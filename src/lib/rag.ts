import { Entry, EntrySkeletonType } from 'contentful';

export interface RagChunk {
    internalId: string; // The group ID (original entry ID)
    chunkIndex: number;
    content: string;
    metadata: RagMetadata;
}

export interface RagMetadata {
    internalId: string;
    chunkIndex: number;
    locale: string;
    type: string;
    audience: string[];
    tags: string[];
    stack: string[];
    priority: number;
    source: string;
    updatedAt: string;
    slug: string;
    title?: string; // Optional helper for context
    summary?: string; // Optional helper
}

// Helper to determine if we should chunk
const SINGLE_CHUNK_TYPES = ['skill', 'stack', 'faq', 'certification', 'talk'];
const SPLIT_CHUNK_TYPES = ['project', 'experience', 'bio', 'general'];

export function chunkEntry(entry: Entry<EntrySkeletonType, undefined, string>): RagChunk[] {
    const fields = entry.fields as any;
    const sys = entry.sys;
    const entryId = sys.id;
    const updatedAt = sys.updatedAt;
    const contentType = fields.type || 'general';

    // Base Metadata
    // arrays might be undefined, ensure []
    const audience = fields.audience || [];
    const tags = fields.tags || [];
    const stack = fields.stack || [];
    const priority = fields.priority || 1;
    const slug = fields.slug || entryId;
    const locale = 'en-US'; // Default for now

    const baseMetadata: Omit<RagMetadata, 'chunkIndex'> = {
        internalId: entryId,
        locale,
        type: contentType,
        audience,
        tags,
        stack,
        priority,
        source: `contentful:${entryId}`,
        updatedAt,
        slug,
        title: fields.title,
        summary: fields.summary,
    };

    const rawContent = fields.content || '';

    // Strategy 1: Single Chunk
    if (SINGLE_CHUNK_TYPES.includes(contentType)) {
        // For single chunks, we combine robust context: Title + Summary + Content + Highlights?
        const combinedContent = [
            fields.title ? `# ${fields.title}` : '',
            fields.summary ? `> ${fields.summary}` : '',
            rawContent,
            // Handle highlights if present for single chunk items? Usually they are small.
            fields.highlights ? `\nHighlights:\n- ${fields.highlights.join('\n- ')}` : ''
        ].filter(Boolean).join('\n\n');

        return [{
            internalId: entryId,
            chunkIndex: 0,
            content: combinedContent,
            metadata: { ...baseMetadata, chunkIndex: 0 }
        }];
    }

    // Strategy 2: Smart Chunking for Long Content
    // We want to split by logical sections but keep context.
    // Prepend Title and Summary to EACH chunk so the LLM knows what this slice is about.

    const contextHeader = [
        fields.title ? `Context: ${fields.title}` : '',
        fields.summary ? `Summary: ${fields.summary}` : ''
    ].filter(Boolean).join('\n');

    // Split by H2 (##) or H3 (###) or double newline if no headers
    // This is a naive split; we can get fancier.
    // Let's split by double newline first to get paragraphs, then group them.

    const paragraphs = rawContent.split(/\n\n+/);
    const chunks: RagChunk[] = [];
    let currentChunkStr = '';
    const TARGET_CHUNK_SIZE = 1500;

    let chunkIndex = 0;

    for (const para of paragraphs) {
        // If adding this paragraph exceeds target size (and current chunk is not empty)
        if (currentChunkStr.length + para.length > TARGET_CHUNK_SIZE && currentChunkStr.length > 0) {
            // Flush current chunk
            chunks.push({
                internalId: entryId,
                chunkIndex,
                content: `${contextHeader}\n\n${currentChunkStr}`.trim(),
                metadata: { ...baseMetadata, chunkIndex }
            });
            chunkIndex++;
            currentChunkStr = para;
        } else {
            currentChunkStr = currentChunkStr ? `${currentChunkStr}\n\n${para}` : para;
        }
    }

    // Flush remaining
    if (currentChunkStr.length > 0) {
        chunks.push({
            internalId: entryId,
            chunkIndex,
            content: `${contextHeader}\n\n${currentChunkStr}`.trim(),
            metadata: { ...baseMetadata, chunkIndex }
        });
    }

    // Fallback: If no content, just index title/summary? 
    if (chunks.length === 0 && (fields.title || fields.summary)) {
        chunks.push({
            internalId: entryId,
            chunkIndex: 0,
            content: `${contextHeader}`.trim(),
            metadata: { ...baseMetadata, chunkIndex: 0 }
        });
    }

    return chunks;
}
