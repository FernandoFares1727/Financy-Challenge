import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractTokenFromHeader,
} from "./auth";
import { Context } from "./types";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    async me(_: any, __: any, context: Context) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      return prisma.user.findUnique({
        where: { id: context.userId },
        include: {
          transactions: true,
          categories: true,
        },
      });
    },

    async categories(_: any, __: any, context: Context) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      return prisma.category.findMany({
        where: { userId: context.userId },
        include: { transactions: true },
      });
    },

    async category(
      _: any,
      { id }: { id: string },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const category = await prisma.category.findUnique({
        where: { id },
        include: { transactions: true },
      });

      if (!category || category.userId !== context.userId) {
        throw new Error("Category not found");
      }

      return category;
    },

    async transactions(_: any, __: any, context: Context) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      return prisma.transaction.findMany({
        where: { userId: context.userId },
        include: { category: true },
      });
    },

    async transaction(
      _: any,
      { id }: { id: string },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!transaction || transaction.userId !== context.userId) {
        throw new Error("Transaction not found");
      }

      return transaction;
    },
  },

  Mutation: {
    async signup(
      _: any,
      { email, password, name }: { email: string; password: string; name: string }
    ) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = generateToken(user.id, user.email);

      return {
        token,
        user,
      };
    },

    async login(
      _: any,
      { email, password }: { email: string; password: string }
    ) {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const passwordValid = await comparePassword(password, user.password);

      if (!passwordValid) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken(user.id, user.email);

      return {
        token,
        user,
      };
    },

    async createCategory(
      _: any,
      { name, color = "#3B82F6", icon = "📁" }: { name: string; color?: string; icon?: string },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      return prisma.category.create({
        data: {
          name,
          color,
          icon,
          userId: context.userId,
        },
        include: {
          transactions: true,
        },
      });
    },

    async updateCategory(
      _: any,
      { id, name, color, icon }: { id: string; name?: string; color?: string; icon?: string },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category || category.userId !== context.userId) {
        throw new Error("Category not found");
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (color !== undefined) updateData.color = color;
      if (icon !== undefined) updateData.icon = icon;

      return prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          transactions: true,
        },
      });
    },

    async deleteCategory(
      _: any,
      { id }: { id: string },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category || category.userId !== context.userId) {
        throw new Error("Category not found");
      }

      // Delete all transactions associated with this category
      await prisma.transaction.deleteMany({
        where: { categoryId: id },
      });

      // Then delete the category
      await prisma.category.delete({
        where: { id },
      });

      return true;
    },

    async createTransaction(
      _: any,
      {
        title,
        description,
        amount,
        type,
        date,
        categoryId,
      }: {
        title: string;
        description?: string;
        amount: number;
        type: string;
        date: string;
        categoryId: string;
      },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category || category.userId !== context.userId) {
        throw new Error("Category not found");
      }

      return prisma.transaction.create({
        data: {
          title,
          description,
          amount,
          type,
          date: new Date(date),
          categoryId,
          userId: context.userId,
        },
        include: { category: true },
      });
    },

    async updateTransaction(
      _: any,
      {
        id,
        title,
        description,
        amount,
        type,
        date,
        categoryId,
      }: {
        id: string;
        title?: string;
        description?: string;
        amount?: number;
        type?: string;
        date?: string;
        categoryId?: string;
      },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction || transaction.userId !== context.userId) {
        throw new Error("Transaction not found");
      }

      if (categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category || category.userId !== context.userId) {
          throw new Error("Category not found");
        }
      }

      const updateData: any = {
        title,
        description,
        amount,
        type,
        categoryId,
      };

      if (date) {
        updateData.date = new Date(date);
      }

      return prisma.transaction.update({
        where: { id },
        data: updateData,
        include: { category: true },
      });
    },

    async deleteTransaction(
      _: any,
      { id }: { id: string },
      context: Context
    ) {
      if (!context.userId) {
        throw new Error("Not authenticated");
      }

      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction || transaction.userId !== context.userId) {
        throw new Error("Transaction not found");
      }

      await prisma.transaction.delete({
        where: { id },
      });

      return true;
    },
  },
};
