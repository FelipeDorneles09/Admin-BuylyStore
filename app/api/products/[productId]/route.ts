import Category from "@/lib/models/Category";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    const product = await Product.findById(params.productId).populate([
      {
        path: "collections",
        model: Collection,
      },
      {
        path: "categories",
        model: Category,
      },
    ]);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const {
      title,
      description,
      media,
      categories,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !categories || !price || !expense) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
    }

    // Validar se `categories` e `collections` são arrays de strings
    if (!Array.isArray(categories) || !Array.isArray(collections)) {
      return new NextResponse(
        "Categories and collections must be arrays of IDs",
        { status: 400 }
      );
    }

    // Mapear IDs para strings (caso estejam como objetos ou outros tipos)
    const currentCategories = product.categories.map(String);
    const currentCollections = product.collections.map(String);

    const addedCategories = categories.filter(
      (categoryId: string) => !currentCategories.includes(categoryId)
    );

    const removedCategories = currentCategories.filter(
      (categoryId: string) => !categories.includes(categoryId)
    );

    const addedCollections = collections.filter(
      (collectionId: string) => !currentCollections.includes(collectionId)
    );

    const removedCollections = currentCollections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );

    // Atualizar categorias no banco
    await Promise.all([
      ...addedCategories.map((categoryId: string) =>
        Category.findByIdAndUpdate(categoryId, {
          $push: { products: product._id },
        })
      ),
      ...removedCategories.map((categoryId: string) =>
        Category.findByIdAndUpdate(categoryId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Atualizar coleções no banco
    await Promise.all([
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Atualizar o produto com os novos dados
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        categories,
        collections,
        tags,
        sizes,
        colors,
        price,
        expense,
      },
      { new: true }
    ).populate([
      { path: "collections", model: Collection },
      { path: "categories", model: Category },
    ]);

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    // Update collections
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    await Promise.all(
      product.categories.map((categoryId: string) =>
        Category.findByIdAndUpdate(categoryId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
