"use client";

import React, { useEffect, useRef, useState } from "react";

// Carousel component for two images
interface CarouselImage {
    src: string;
    alt: string;
}

function Carousel({ images }: { images: CarouselImage[] }) {
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [animating, setAnimating] = useState(false);
    const total = images.length;
    const goTo = (idx: number) => {
        if (idx === current) return;
        setPrev(current);
        setCurrent((idx + total) % total);
        setAnimating(true);
    };

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (total <= 1) return;
        const interval = setInterval(() => {
            setPrev(current);
            setCurrent((prev) => (prev + 1) % total);
            setAnimating(true);
        }, 4000);
        return () => clearInterval(interval);
    }, [total, current]);

    // End animation after duration
    useEffect(() => {
        if (!animating) return;
        const timeout = setTimeout(() => setAnimating(false), 500);
        return () => clearTimeout(timeout);
    }, [animating]);

    return (
        <div className="relative w-full overflow-hidden" style={{ minHeight: 120, maxHeight: 320 }}>
            {/* Previous image for animation */}
            {animating && prev !== null && (
                <img
                    src={images[prev].src}
                    alt={images[prev].alt}
                    className="w-full h-auto object-contain rounded-lg absolute top-0 left-0 transition-all duration-500 opacity-100 z-10"
                    style={{
                        transform: 'translateX(0%)',
                        opacity: 0.2,
                        zIndex: 10,
                        pointerEvents: 'none',
                    }}
                />
            )}
            {/* Current image with slide/fade in */}
            <img
                src={images[current].src}
                alt={images[current].alt}
                className={`w-full h-auto object-contain rounded-lg transition-all duration-500 ${animating ? 'animate-slidein' : ''}`}
                style={{
                    minHeight: 120,
                    maxHeight: 320,
                    position: animating ? 'relative' : undefined,
                    zIndex: 20,
                }}
            />
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`w-2.5 h-2.5 rounded-full ${idx === current ? 'bg-[#ffa206]' : 'bg-gray-300'} border border-white shadow`}
                        onClick={() => goTo(idx)}
                        style={{ outline: 'none' }}
                    />
                ))}
            </div>
            {/* Animation keyframes (Tailwind CSS custom) */}
            <style>{`
                @keyframes slidein {
                    0% { opacity: 0; transform: translateX(40px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                .animate-slidein {
                    animation: slidein 0.5s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </div>
    );
}
import { Autocomplete, TextField } from "@mui/material";

interface Exhibitor {
    email: string;
    city?: string;
    urn?: string;
    hallNumber?: string | null;
    stallNumber?: string | null;
    productGroupName?: string;
    exhibitorName: string;
    contactPersonName: string;
    // API returns productCategory as a JSON-array string like '["9.1 Skill Institutes"]'
    productCategory?: string | string[] | null;
}

import axios from "axios";
import { BASE_URL } from "src/config-global";
import { useForm } from "react-hook-form";
import FormProvider from "src/sections/form-view/hook-form/form-provider";
import {
    RHFCountrySelect,
    RHFStateSelect,
} from "src/sections/form-view/hook-form/rhf-country-state-city";
import { getProductGroups, ProductGroup } from "src/api/exhibitor-directory";
import { productGroupsAndCategories } from "src/assets/data/productCategories";
import { useExhibitorCountries } from "src/hooks/use-exhibitor-countries";

const API_URL = `${BASE_URL}/bts/api/v1`;

interface IExhibitorDirectoryFilters {
    country: string | null;
    state: string | null;
    category: string | null;
    productGroupId: string | null;
    search: string | null;
}

const defaultFilters: IExhibitorDirectoryFilters = {
    country: '',
    state: '',
    category: '',
    productGroupId: '',
    search: '',
};

// Design tokens
const BASE_ACCENT = '#ffa206'; // primary pink from the banner
const GROUP_COLOR_PALETTE = [
    '#0f4c81', // deep blue
    '#0ea5a4', // teal
    '#f59e0b', // amber
    '#10b981', // green
    '#2563eb', // blue
    '#7c3aed', // violet
    '#ef4444', // red
    '#f97316', // orange
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#e11d48', // pink red
    '#ffa206', // banner pink
];

function pickColor(key?: string | null, idx = 0) {
    if (!key) return GROUP_COLOR_PALETTE[idx % GROUP_COLOR_PALETTE.length];
    let sum = 0;
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    return GROUP_COLOR_PALETTE[sum % GROUP_COLOR_PALETTE.length];
}

function hexToRgba(hex: string, alpha = 1) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ExhibitorListPage() {
    const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<IExhibitorDirectoryFilters>(defaultFilters);
    const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
    const [noteOpen, setNoteOpen] = useState(false);

    const methods = useForm<IExhibitorDirectoryFilters>({ defaultValues: defaultFilters });
    const { watch, setValue } = methods;
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchExhibitors = async (page: number, reset: boolean = false, filterOverrides?: IExhibitorDirectoryFilters) => {
        // Cancel any previous in-flight request to prevent stale data overwriting fresh results
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        try {
            const usedFilters = filterOverrides ?? filters;
            const params = {
                pageNumber: page,
                pageSize: 20,
                ...usedFilters,
            };
            const res = await axios.get(
                `${API_URL}/buyer/exhibitor-list`,
                {
                    params,
                    headers: {
                        Accept: "application/json",
                    },
                    signal: controller.signal,
                }
            );
            if (res.data.status) {
                setPageNumber(page);
                setTotalPages(res.data.data.totalPages);
                setExhibitors((prev) =>
                    reset ? res.data.data.items : [...prev, ...res.data.data.items]
                );
            }
        } catch (err: any) {
            if (axios.isCancel(err) || err?.name === 'CanceledError') return;
            // Handle other errors
        } finally {
            setLoading(false);
        }
    };

    // Watch form values and update filters (debounced)
    const watchedCountry = watch("country");
    const watchedState = watch("state");
    const watchedCategory = watch("category");
    const watchedProductGroupId = watch("productGroupId");
    const watchedSearch = watch("search");

    const { countries: customCountries, states: customStates } = useExhibitorCountries(
        watchedProductGroupId || "",
        watchedCountry || "",
    );

    useEffect(() => {
        const sendHeight = () => {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: "HEIGHT", height }, "*");
            console.log("Height sent:", height);
        };

        sendHeight();

        const intervalId = setInterval(sendHeight, 1000);

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
        }, 10000);

        window.addEventListener("resize", sendHeight);

        const resizeObserver = new ResizeObserver(() => {
            sendHeight();
        });

        resizeObserver.observe(document.body);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            window.removeEventListener("resize", sendHeight);
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            const newFilters: IExhibitorDirectoryFilters = {
                country: watchedCountry || "",
                state: watchedState || "",
                category: watchedCategory || "",
                productGroupId: watchedProductGroupId || "",
                search: watchedSearch || "",
            };
            setFilters(newFilters);
            fetchExhibitors(1, true, newFilters);
        }, 350);
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedCountry, watchedState, watchedCategory, watchedProductGroupId, watchedSearch]);

    // Infinite scroll using IntersectionObserver
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!sentinelRef.current) return;
        const observer = new window.IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (
                    entry.isIntersecting &&
                    !loading &&
                    pageNumber < totalPages
                ) {
                    fetchExhibitors(pageNumber + 1);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0,
            }
        );
        observer.observe(sentinelRef.current);
        return () => {
            observer.disconnect();
        };
    }, [loading, pageNumber, totalPages, filters]);

    // Filter change handler
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // keep form and local filters in sync
        setValue(name as any, value);
    };

    // fetch product groups for productGroup select
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const groups = await getProductGroups();
                if (mounted) {
                    // ensure deterministic alphabetical ordering in UI
                    const sorted = (groups || []).slice().sort((a, b) =>
                        String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' })
                    );
                    setProductGroups(sorted);
                }
            } catch (err) {
                // ignore
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);



    // Update category options when product group changes
    useEffect(() => {
        // Reset category selection whenever product group changes
        setValue("category", "");

        if (!watchedProductGroupId) {
            setCategoryOptions([]);
            return;
        }
        const selected = productGroups.find((g) => String(g.id) === String(watchedProductGroupId));
        const name = selected?.name;
        if (name && (productGroupsAndCategories as any)[name]) {
            setCategoryOptions((productGroupsAndCategories as any)[name]);
        } else {
            setCategoryOptions([]);
        }
    }, [watchedProductGroupId, productGroups]);

    return (
        <div>
            <div className="mb-6 rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-center">
                    {/* Simple carousel for two images */}
                    <div className="relative w-full">
                        <Carousel images={[
                            { src: "/Directory Page Banners-1.jpg", alt: "IFEX banner 1" },
                            { src: "/Directory Page Banners-2.jpg", alt: "IFEX banner 2" },
                        ]} />
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-4" style={{ backgroundImage: `radial-gradient(${hexToRgba('#000', 0.02)} 1px, transparent 1px)`, backgroundSize: '18px 18px' }}>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">IFEX 2026 Pre-fair Directory</h1>
                <div className="mb-8 p-6 bg-white rounded-xl flex flex-col gap-4 mx-auto w-fit shadow">
                    <FormProvider methods={methods}>
                        <div className="flex flex-wrap gap-4 w-full items-end">
                            <div className="w-full md:w-48">
                                <label className="block text-gray-700 font-medium mb-2">Product Group</label>
                                <Autocomplete
                                    options={productGroups}
                                    value={productGroups.find((g) => String(g.id) === String(watch("productGroupId") || "")) || null}
                                    onChange={(_, newValue) => setValue("productGroupId", newValue ? String(newValue.id) : "")}
                                    getOptionLabel={(option) => option?.name || ""}
                                    isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
                                    sx={{ width: "100%" }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select Product group"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "white",
                                                    paddingRight: "39px !important",
                                                    height: "53px",
                                                    "& fieldset": {
                                                        borderColor: "#D1D5DB",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: BASE_ACCENT,
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: BASE_ACCENT,
                                                        borderWidth: "2px",
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    padding: "4px 18px 4px 4px !important",
                                                },
                                            }}
                                        />
                                    )}
                                    ListboxProps={{ style: { maxHeight: 300 } }}
                                />
                            </div>

                            {
                                watch("productGroupId") &&
                                <div className="w-full md:w-48">
                                    <label className="block text-gray-700 font-medium mb-2">Product Category</label>
                                    <Autocomplete
                                        options={categoryOptions}
                                        value={categoryOptions.find((c) => c.value === (watch("category") || "")) || null}
                                        onChange={(_, newValue) => setValue("category", newValue ? newValue.value : "")}
                                        getOptionLabel={(option) => option?.label || ""}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                        sx={{ width: "100%" }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="All Categories"
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        backgroundColor: "white",
                                                        paddingRight: "39px !important",
                                                        height: "53px",
                                                        "& fieldset": {
                                                            borderColor: "#D1D5DB",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: BASE_ACCENT,
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: BASE_ACCENT,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        padding: "4px 18px 4px 4px !important",
                                                    },
                                                }}
                                            />
                                        )}
                                        ListboxProps={{ style: { maxHeight: 300 } }}
                                    />
                                </div>
                            }


                            <div className="w-full md:w-48">
                                <label className="block text-gray-700 font-medium mb-2">Country</label>
                                <RHFCountrySelect name="country" placeholder="Country" customCountries={customCountries} />
                            </div>

                            <div className="w-full md:w-48">
                                <label className="block text-gray-700 font-medium mb-2">State</label>
                                <RHFStateSelect name="state" countryFieldName="country" placeholder="State" customStates={customStates} />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full items-end mt-4">
                            <div className="w-full">
                                <label className="block text-gray-700 font-medium mb-2">Search</label>
                                <TextField
                                    {...methods.register("search")}
                                    placeholder="Search company name, product group, product category, country, state, city..."
                                    size="small"
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "white",
                                            paddingRight: "39px !important",
                                            height: "53px",
                                            pl: "8px",
                                            "& fieldset": {
                                                borderColor: "#D1D5DB",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: BASE_ACCENT,
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: BASE_ACCENT,
                                                borderWidth: "2px",
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "4px 18px 4px 4px !important",
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </FormProvider>
                </div>
                <div
                    className="mb-6 rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${hexToRgba(BASE_ACCENT, 0.2)}`, background: '#fff', boxShadow: `0 2px 12px ${hexToRgba(BASE_ACCENT, 0.06)}` }}
                >
                    {/* Header / toggle */}
                    <button
                        type="button"
                        onClick={() => setNoteOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200"
                        style={{ background: noteOpen ? hexToRgba(BASE_ACCENT, 0.06) : hexToRgba(BASE_ACCENT, 0.03), borderBottom: noteOpen ? `1px solid ${hexToRgba(BASE_ACCENT, 0.15)}` : 'none' }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: hexToRgba(BASE_ACCENT, 0.12) }}>
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="9" stroke={BASE_ACCENT} strokeWidth="1.8" />
                                    <rect x="9.1" y="8.5" width="1.8" height="6" rx="0.9" fill={BASE_ACCENT} />
                                    <circle cx="10" cy="6.2" r="1" fill={BASE_ACCENT} />
                                </svg>
                            </div>
                            <div>

                                <span className="text-sm font-bold tracking-wide" style={{ color: BASE_ACCENT }}>Note on &ldquo;Combined&rdquo; Product Category</span>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    If an exhibitor is listed under the{' '}
                                    <span className="font-semibold px-1.5 py-0.5 rounded" style={{ background: hexToRgba(BASE_ACCENT, 0.09), color: BASE_ACCENT }}>&ldquo;Combined&rdquo;</span>{' '}
                                    product category within any Product Group, it indicates they are a manufacturer of multiple sub-categories (typically 2–3) within that specific group.
                                </p>
                            </div>
                        </div>
                        {noteOpen ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                                <line x1="5" y1="10" x2="15" y2="10" stroke={BASE_ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                                <line x1="10" y1="5" x2="10" y2="15" stroke={BASE_ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="5" y1="10" x2="15" y2="10" stroke={BASE_ACCENT} strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        )}
                    </button>

                    {/* Body */}
                    {noteOpen && (
                        <div className="px-5 pb-5 pt-4">
                            {/* <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                If an exhibitor is listed under the{' '}
                                <span className="font-semibold px-1.5 py-0.5 rounded" style={{ background: hexToRgba(BASE_ACCENT, 0.09), color: BASE_ACCENT }}>&ldquo;Combined&rdquo;</span>{' '}
                                category within any Product Group, it indicates they are a manufacturer of multiple sub-categories (typically 2–3) within that specific group.
                            </p> */}
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">For instance</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[
                                    { group: 'Apparel & Fashion', desc: 'Menswear, Womenswear & Kidswear' },
                                    { group: 'Fabrics & Accessories', desc: 'Knitted and Woven products' },
                                    { group: 'Home Textiles', desc: 'Bed, Bath and Kitchen Linen' },
                                    { group: 'Fibres & Yarns', desc: 'Fiber, Filament and Recycled Yarns' },
                                    { group: 'Technical Textiles', desc: 'Fabric, Functional Wear and Footwear' },
                                    { group: 'Carpets & Floorcoverings', desc: 'Hand Knotted, Dari and Machine Made' },
                                ].map(({ group, desc }) => (
                                    <div key={group} className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ background: hexToRgba(BASE_ACCENT, 0.04), border: `1px solid ${hexToRgba(BASE_ACCENT, 0.10)}` }}>
                                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BASE_ACCENT, marginTop: 6 }} />
                                        <div>
                                            <span className="text-xs font-bold" style={{ color: BASE_ACCENT }}>{group}</span>
                                            <span className="text-xs text-gray-500"> — {desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {exhibitors.map((ex, idx) => {
                        // ...existing code for rendering exhibitor cards...
                        const groupColor = pickColor(ex.productGroupName || String(idx), idx);
                        const cardGradient = `linear-gradient(135deg, ${hexToRgba(groupColor, 0.06)} 0%, ${hexToRgba(BASE_ACCENT, 0.02)} 100%), linear-gradient(0deg, ${hexToRgba('#fff', 0.02)}, transparent)`;
                        const ringColor = groupColor;
                        const stripNumberPrefix = (str: string) => str.replace(/^\d+(\.\d+)?\s*/, '').replace(/^\s*\.\s*/, '').trim();
                        let categoriesArray: string[] = [];
                        try {
                            const raw = ex.productCategory as any;
                            if (Array.isArray(raw)) categoriesArray = raw as string[];
                            else if (typeof raw === 'string' && raw.trim()) categoriesArray = JSON.parse(raw);
                        } catch (e) {
                            if (typeof ex.productCategory === 'string') {
                                categoriesArray = ex.productCategory.split(',').map((s) => s.trim()).filter(Boolean);
                            }
                        }
                        const displayedCats = categoriesArray.slice(0, 2).map(stripNumberPrefix);
                        const catsMore = categoriesArray.length > displayedCats.length;
                        const cleanProductGroupName = ex.productGroupName ? stripNumberPrefix(ex.productGroupName) : '';

                        return (
                            <div
                                key={ex.urn || idx}
                                className="relative rounded-2xl overflow-hidden group border border-gray-100 transform transition-all duration-300 hover:shadow-2xl"
                                style={{
                                    background: cardGradient,
                                    boxShadow: `0 10px 24px ${hexToRgba('#000', 0.04)}`,
                                    backgroundBlendMode: 'normal',
                                    borderLeft: `4px solid ${BASE_ACCENT}`,
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 z-0" />
                                {/* ...existing code for exhibitor card... */}
                                <div className="relative z-20 p-6 md:p-8 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center" style={{ background: hexToRgba(groupColor, 0.08), border: `1px solid ${hexToRgba(groupColor, 0.12)}` }}>
                                                <span className="font-bold" style={{ color: ringColor }}>{(ex.exhibitorName || "").charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-xl text-gray-900">{(ex.exhibitorName || '').toUpperCase()}</div>
                                                {cleanProductGroupName && (
                                                    <div className="text-sm mt-1 inline-block px-2 py-1 rounded" style={{ background: hexToRgba(groupColor, 0.10), color: groupColor, fontWeight: 500 }}>
                                                        {cleanProductGroupName.toUpperCase()}
                                                    </div>
                                                )}
                                                {displayedCats.length > 0 && (
                                                    <div className="text-sm mt-1" style={{ color: hexToRgba('#374151', 0.8) }}>
                                                        <span className="font-medium" style={{ color: groupColor }}>{displayedCats.map(s => s.toUpperCase()).join(', ')}{catsMore ? '…' : ''}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center text-slate-600">C</div>
                                            <div className="text-sm">CITY: <span className="font-medium">{(ex.city || '').toUpperCase()}</span></div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center text-slate-600">@</div>
                                            <div className="text-sm">EMAIL: <a href={`mailto:${ex.email}`} className="inline-flex items-center text-sm font-medium" style={{ color: groupColor, background: hexToRgba(groupColor, 0.06), padding: '4px 8px', borderRadius: 8 }}>{(ex.email || '').toUpperCase()}</a></div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center text-slate-600">P</div>
                                            <div className="text-sm">CONTACT: <span className="font-medium">{(ex.contactPersonName || '').toUpperCase()}</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 right-8 w-36 h-36 rounded-full opacity-12 blur-3xl transform rotate-12" style={{ background: `linear-gradient(135deg, ${hexToRgba(groupColor, 0.14)}, ${hexToRgba(BASE_ACCENT, 0.08)})` }} />
                            </div>
                        );
                    })}
                    {/* Sentinel div for infinite scroll */}
                    <div ref={sentinelRef} style={{ height: 1 }} />
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <svg className="animate-spin h-6 w-6 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span className="text-gray-600 font-medium">Loading...</span>
                    </div>
                )}
                {!loading && exhibitors.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-lg">No exhibitors found.</div>
                )}
            </div>
        </div>
    );
}
