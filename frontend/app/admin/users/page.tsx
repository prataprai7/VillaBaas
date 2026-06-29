import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "../_components/UserTable";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const q      = await searchParams;
    const page   = q.page   ? parseInt(q.page)   : 1;
    const limit  = q.limit  ? parseInt(q.limit)  : 10;
    const search = q.search ?? "";

    const result = await handleGetAllUsers({ page, limit, search });

    if (!result.success) throw new Error("Failed to load users");

    return <UserTable data={result.data} pagination={result.pagination} search={search} />;
}
