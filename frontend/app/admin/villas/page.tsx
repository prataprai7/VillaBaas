import { handleGetAllVillas } from "@/lib/actions/admin/villa-action";
import VillaTable from "../_components/VillaTable";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const q      = await searchParams;
    const page   = q.page   ? parseInt(q.page)   : 1;
    const limit  = q.limit  ? parseInt(q.limit)  : 10;
    const search = q.search ?? "";

    const result = await handleGetAllVillas({ page, limit, search });

    if (!result.success) throw new Error("Failed to load villas");

    return <VillaTable data={result.data} pagination={result.pagination} search={search} />;
}