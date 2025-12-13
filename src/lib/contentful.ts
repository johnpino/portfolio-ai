import { createClient, EntrySkeletonType } from 'contentful';

const getClient = () => {
    const space = process.env.CONTENTFUL_SPACE_ID || 'dummy-space';
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN || 'dummy-token';
    const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

    return createClient({ space, accessToken, environment });
};

// Helper to fetch multiple entries by ID
export async function getEntriesByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const response = await getClient().getEntries<EntrySkeletonType>({
        'sys.id[in]': ids,
        include: 2, // Include linked assets/entries depth
    });

    return response.items;
}

export async function getEntryById(id: string) {
    const response = await getClient().getEntry<EntrySkeletonType>(id, {
        include: 2,
    });
    return response;
}
