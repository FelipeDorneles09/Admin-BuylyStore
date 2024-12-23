import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoDB";
import AboutUs from "@/lib/models/AboutUs";

export const GET = async (
  req: NextRequest,
  { params }: { params: { aboutusId: string } }
) => {
  try {
    await connectToDB();

    const aboutUs = await AboutUs.findById(params.aboutusId);
    if (!aboutUs) {
      return new NextResponse(
        JSON.stringify({ message: "About Us not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(aboutUs, { status: 200 });
  } catch (err) {
    console.log("[aboutusId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { aboutusId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let aboutUs = await AboutUs.findById(params.aboutusId);

    if (!aboutUs) {
      return new NextResponse("About Us not found", { status: 404 });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    aboutUs = await AboutUs.findByIdAndUpdate(
      params.aboutusId,
      { title, description, image },
      { new: true }
    );

    await aboutUs.save();

    return NextResponse.json(aboutUs, { status: 200 });
  } catch (err) {
    console.log("[aboutusId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { aboutusId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await AboutUs.findByIdAndDelete(params.aboutusId);

    return new NextResponse("About Us is deleted", { status: 200 });
  } catch (err) {
    console.log("[aboutusId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
