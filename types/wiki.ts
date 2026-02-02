export interface WikiTreeNode {
    id: string;
    parent_id?: string;
    slug: string;
    path: string;
    title: string;
    is_container: boolean;
    order: number;
    has_children: boolean;
    children?: WikiTreeNode[];
}

export interface WikiTreeResponse {
    code: number;
    message: string;
    data: WikiTreeNode;
}
