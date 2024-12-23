import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import AboutUs from "@/lib/models/AboutUs";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectToDB();

    const { title, description, image } = await req.json();
    if (!title || !image) {
      return new NextResponse(
        JSON.stringify({ error: "Title and image are required" }),
        { status: 400 }
      );
    }

    const newAboutUs = new AboutUs({
      title,
      description,
      image,
    });
    await newAboutUs.save();

    return NextResponse.json(newAboutUs, { status: 201 });
  } catch (err) {
    console.error("[aboutus_POST]", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    await connectToDB();

    const aboutUs = await AboutUs.find(); // Encontrando todos os documentos
    if (!aboutUs || aboutUs.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "About Us not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(aboutUs, { status: 200 });
  } catch (err) {
    console.error("[aboutus_GET]", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
