import { readTemplateStructureFromJson, saveTemplateStructureToJson } from "@/features/playground/libs/PathToJson";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import { templatePaths } from "@/lib/template";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const param = await params;
    const { id } = param;

    if (!id) {
        return Response.json({ error: "Missing playground ID" }, { status: 400 });
    }

    const playground = await db.playground.findUnique({
        where: { id },
    });

    if (!playground) {
        return Response.json({ error: "Playground not found" }, { status: 404 });
    }

    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey];

    if (!templatePath) {
        return Response.json({ error: "Invalid template" }, { status: 404 });
    }

    try {
        const inputPath = path.join(process.cwd(), templatePath);
        const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);

        console.log("Input Path:", inputPath);
        console.log("Output Path:", outputFile);

        await saveTemplateStructureToJson(inputPath, outputFile);
        const result = await readTemplateStructureFromJson(outputFile);

        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
        }

        await fs.unlink(outputFile);
        console.log("resulttttttttttttttttttttttttttttttttttttttttttttttttttttttt", result);
        return Response.json({ success: true, message: "fetched successfuly", templateJson: result }, { status: 200 });
    } catch (error) {
        console.log("error", error);
    }
}

function validateJsonStructure(data: unknown): boolean {
    try {
        JSON.parse(JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Invalid JSON structure:", error);
        return false;
    }
}
