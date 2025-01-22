"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/aboutus/AboutUsColumns";
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [aboutUsItems, setAboutUsItems] = useState([]);

  const getAboutUsItems = async () => {
    try {
      const res = await fetch("/api/aboutus", {
        method: "GET",
      });
      const data = await res.json();
      setAboutUsItems(data);
      setLoading(false);
    } catch (err) {
      console.log("[aboutus_GET]", err);
    }
  };

  useEffect(() => {
    getAboutUsItems();
  }, []);

  return (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Sobre Nós</p>
        {aboutUsItems.length === 0 && (
          <Button
            className="bg-blue-1 text-white"
            onClick={() => router.push("/aboutus/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Sobre Nós
          </Button>
        )}
      </div>
      <Separator className="my-4 bg-grey-1" />
      <DataTable columns={columns} data={aboutUsItems} searchKey="title" />
    </div>
  );
};

export default AboutUs;
