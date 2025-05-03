// ====== constants ======
export const BUCKETS = {
    COF: 'COF_BUCKET',
};

export const PATHS = {
    CERTIFICATES_FOLDER: 'files',
};

import { supabase } from "./supabase_client";
async function main() {
    console.log('Starting bucket setup...');

    const { data, error } = await supabase.storage.createBucket(BUCKETS.COF, { public: true });

    if (error) {
        if (error.message === 'The resource already exists') {
            console.log(`Bucket '${BUCKETS.COF}' already exists. Skipping creation.`);
        } else {
            console.error('Error creating bucket:', error);
            throw error;
        }
    } else {
        console.log(`Bucket '${BUCKETS.COF}' created successfully.`);
    }

    console.log('Bucket setup complete.');
}

main().catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
});
