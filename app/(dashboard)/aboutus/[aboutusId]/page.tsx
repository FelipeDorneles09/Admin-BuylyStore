"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/custom ui/Loader";
import AboutUsForm from "@/components/aboutus/AboutUsForm";

const AboutUsDetails = ({ params }: { params: { aboutusId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [aboutUsDetails, setAboutUsDetails] = useState<AboutUsType | null>(
    null
  );

  const getAboutUsDetails = async () => {
    try {
      const res = await fetch(`/api/aboutus/${params.aboutusId}`, {
        method: "GET",
      });
      const data = await res.json();
      setAboutUsDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[aboutusId_GET]", err);
    }
  };

  useEffect(() => {
    getAboutUsDetails();
  }, []);

  return loading ? <Loader /> : <AboutUsForm initialData={aboutUsDetails} />;
};

export default AboutUsDetails;
