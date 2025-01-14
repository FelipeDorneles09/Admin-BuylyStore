import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/lib/models/Category";

const corsHeaders = {
  "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
  "Access-Control-Allow-Methods": "GET, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 403,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    const { title, image } = await req.json();

    const existingCategory = await Category.findOne({ title });

    if (existingCategory) {
      return new NextResponse("Category already exists", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!title || !image) {
      return new NextResponse("Title and image are required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const newCategory = await Category.create({
      title,
      image,
    });

    return NextResponse.json(newCategory, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[categories_POST]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const GET = async () => {
  try {
    await connectToDB();

    const categories = await Category.find().sort({ createdAt: "desc" });

    return NextResponse.json(categories, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[categories_GET]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const dynamic = "force-dynamic";
