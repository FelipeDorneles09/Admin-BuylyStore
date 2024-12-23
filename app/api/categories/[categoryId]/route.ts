import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

import { connectToDB } from "@/lib/mongoDB";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  try {
    if (!mongoose.isValidObjectId(params.categoryId)) {
      return new NextResponse("Invalid category ID", { status: 400 });
    }

    await connectToDB();

    const category = await Category.findById(params.categoryId).populate({
      path: "products",
      model: Product,
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    console.error("[categoryId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!mongoose.isValidObjectId(params.categoryId)) {
      return new NextResponse("Invalid category ID", { status: 400 });
    }

    await connectToDB();

    let category = await Category.findById(params.categoryId);

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const { title, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    category = await Category.findByIdAndUpdate(
      params.categoryId,
      { title, image },
      { new: true }
    );

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    console.error("[categoryId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!mongoose.isValidObjectId(params.categoryId)) {
      return new NextResponse("Invalid category ID", { status: 400 });
    }

    await connectToDB();

    await Category.findByIdAndDelete(params.categoryId);

    await Product.updateMany(
      { categories: params.categoryId },
      { $pull: { categories: params.categoryId } }
    );

    return new NextResponse("Category is deleted", { status: 200 });
  } catch (err) {
    console.error("[categoryId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
