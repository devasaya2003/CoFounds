import {
    useState,
    useEffect,
    useTransition,
    useRef,
    useCallback,
} from 'react';

export interface FlowConfig<
    ProfileItem,
    FormItem extends { id: string },
    NewPayload,
    UpdatePayload
> {
    /** incoming array from API or props */
    initialItems?: ProfileItem[];
    /** map each ProfileItem into your form’s item shape */
    mapProfileToFormItem: (item: ProfileItem) => FormItem;
    /** factory for brand-new items (must set a temp-id, e.g. “temp-123”) */
    createFormItem: () => FormItem;
    /** deep-clone a FormItem (for reset) */
    deepCopyFormItem: (item: FormItem) => FormItem;
    /** compare two FormItems for “modified”-ness */
    isItemModified: (item: FormItem, original: FormItem) => boolean;
    /** how to turn a new FormItem into your API’s “create” payload */
    mapToNewPayload: (item: FormItem) => NewPayload;
    /** how to turn an existing, modified FormItem into your API’s “update” payload */
    mapToUpdatePayload: (item: FormItem) => UpdatePayload;
    /** key-extractor (always `item.id`) */
    getId: (item: FormItem) => string;
    /** optional cap on number of items (e.g. MAX_CERTIFICATES) */
    maxItems?: number;
    /** callback to let parent know “dirty” status */
    onChange?: (dirty: boolean) => void;
}

export function useFormFlow<
    ProfileItem,
    FormItem extends { id: string },
    NewPayload,
    UpdatePayload
>(config: FlowConfig<ProfileItem, FormItem, NewPayload, UpdatePayload>) {
    const {
        initialItems,
        mapProfileToFormItem,
        createFormItem,
        deepCopyFormItem,
        isItemModified,
        mapToNewPayload,
        mapToUpdatePayload,
        getId,
        maxItems,
        onChange,
    } = config;

    const [items, setItems] = useState<FormItem[]>([]);
    const [originalItems, setOriginalItems] = useState<FormItem[]>([]);
    const [deletedIds, setDeletedIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isDirty, setIsDirty] = useState(false);

    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    useEffect(() => {
        if (initialItems) {
            const mapped = initialItems.map(mapProfileToFormItem);

            // Only replace items during initialization
            if (isInitializing) {
                setItems(mapped);
                setOriginalItems(mapped.map(deepCopyFormItem));
                setIsInitializing(false);
            } else {
                // Just update originalItems for future resets
                // This prevents dependency cycles with the items state
                setOriginalItems(mapped.map(deepCopyFormItem));
            }
        } else if (isInitializing) {
            setIsInitializing(false);
        }
        // Keep dependencies minimal and stable
    }, [initialItems, isInitializing, mapProfileToFormItem, deepCopyFormItem]);

    useEffect(() => {
        if (!isInitializing && onChange) {
            const hasDeleted = deletedIds.length > 0;
            const hasNew = items.some((i) => getId(i).startsWith('temp-'));
            
            // Only compute if needed
            let hasModified = false;
            if (!hasDeleted && !hasNew) {
                hasModified = items.some((i) => {
                    if (getId(i).startsWith('temp-')) return false;
                    const orig = originalItems.find((o) => getId(o) === getId(i));
                    return orig ? isItemModified(i, orig) : false;
                });
            }
            
            const newDirtyState = hasDeleted || hasNew || hasModified;
            
            // Only call onChange if the dirty state actually changed
            if (newDirtyState !== isDirty) {
                setIsDirty(newDirtyState);
                onChange(newDirtyState);
            }
        }
    }, [items, originalItems, deletedIds, isInitializing, onChange, getId, isItemModified, isDirty]);

    const addItem = useCallback(() => {
        if (maxItems != null && items.length >= maxItems) return;
        startTransition(() => {
            const newItem = createFormItem();
            setItems((prev) => [...prev, newItem]);
            setLastAddedId(getId(newItem));
            if (onChange && !isInitializing) onChange(true);
        });
    }, [
        items.length,
        maxItems,
        createFormItem,
        getId,
        onChange,
        isInitializing,
        startTransition,
    ]);

    const removeItem = useCallback(
        (id: string) => {
            setItems((prev) => prev.filter((i) => getId(i) !== id));
            if (!id.startsWith('temp-')) {
                setDeletedIds((prev) => [...prev, id]);
            }
            if (onChange && !isInitializing) onChange(true);
        },
        [getId, onChange, isInitializing]
    );

    const updateItem = useCallback(
        (id: string, updates: Partial<FormItem>) => {
            setItems((prev) =>
                prev.map((i) =>
                    getId(i) === id ? ({ ...i, ...updates } as FormItem) : i
                )
            );
            if (onChange && !isInitializing) onChange(true);
        },
        [getId, onChange, isInitializing]
    );

    const resetItems = useCallback(() => {
        setItems(originalItems.map(deepCopyFormItem));
        setDeletedIds([]);
        if (onChange) onChange(false);
    }, [originalItems, deepCopyFormItem, onChange]);

    const preparePayload = useCallback(() => {
        const newItems = items
            .filter((i) => getId(i).startsWith('temp-')).map(mapToNewPayload) as NewPayload[];

        const updatedItems = items
            .filter((i) => {
                if (getId(i).startsWith('temp-')) return false;
                const orig = originalItems.find((o) => getId(o) === getId(i));
                return orig ? isItemModified(i, orig) : false;
            }).map(mapToUpdatePayload) as UpdatePayload[];

        return {
            newItems,
            updatedItems,
            deletedIds,
        };
    }, [
        items,
        originalItems,
        deletedIds,
        getId,
        mapToNewPayload,
        mapToUpdatePayload,
        isItemModified,
    ]);

    useEffect(() => {
        if (lastAddedId && !isPending) {
            const el = itemRefs.current.get(lastAddedId);
            if (el) {
                setTimeout(
                    () => el.scrollIntoView({ behavior: 'smooth', block: 'center' }),
                    100
                );
            }
            setLastAddedId(null);
        }
    }, [lastAddedId, isPending]);

    const setItemRef = useCallback((id: string, el: HTMLDivElement | null) => {
        if (el) itemRefs.current.set(id, el);
        else itemRefs.current.delete(id);
    }, []);

    return {
        items,
        isPending,
        addItem,
        removeItem,
        updateItem,
        resetItems,
        preparePayload,
        setItemRef,
        remaining: maxItems != null ? maxItems - items.length : undefined,
    };
}
