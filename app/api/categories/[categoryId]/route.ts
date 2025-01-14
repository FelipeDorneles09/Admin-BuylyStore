import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST, DELETE",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  try {
    if (!mongoose.isValidObjectId(params.categoryId)) {
      return new NextResponse("Invalid category ID", {
        status: 400,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    const category = await Category.findById(params.categoryId).populate({
      path: "products",
      model: Product,
    });

    if (!category) {
      return new NextResponse("Category not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    return NextResponse.json(category, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[categoryId_GET]", err);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    if (!mongoose.isValidObjectId(params.categoryId)) {
      return new NextResponse("Invalid category ID", {
        status: 400,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    let category = await Category.findById(params.categoryId);

    if (!category) {
      return new NextResponse("Category not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    const { title, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    category = await Category.findByIdAndUpdate(
      params.categoryId,
      { title, image },
      { new: true }
    );

    return NextResponse.json(category, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[categoryId_POST]", err);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 403,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    const { categoryId } = params;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return new NextResponse("Category not found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new NextResponse("Category deleted successfully", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[categories_DELETE]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const dynamic = "force-dynamic";
