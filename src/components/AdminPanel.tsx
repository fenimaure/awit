import { useState, useEffect } from 'react';
import { Save, Eye, ArrowLeft, Image, CheckCircle, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import siteConfig from '../config/siteConfig.json';

interface ImageConfig {
    key: string;
    label: string;
    description: string;
    defaultSrc: string;
}

interface ImageGroup {
    title: string;
    items: ImageConfig[];
}

const IMAGE_GROUPS: ImageGroup[] = [
    {
        title: '🏠 Logo & Branding',
        items: [
            {
                key: 'logo',
                label: 'Site Logo',
                description: 'Appears in navbar, mobile menu, footer, floating button & splash screen',
                defaultSrc: '/logo.jpg',
            },
        ],
    },
    {
        title: '🦸 Hero Section',
        items: [
            {
                key: 'hero-bg-image',
                label: 'Hero Background Image',
                description: 'Main image for the top section (displayed if no video is set)',
                defaultSrc: '',
            },
        ],
    },
    {
        title: '📖 About Section',
        items: [
            {
                key: 'prefab-about',
                label: 'About Section Image',
                description: 'Square image in the "About Quick Home Prefab" section',
                defaultSrc: '/images/prefab-about.svg',
            },
        ],
    },
    {
        title: '🏗 Prefab Types',
        items: [
            {
                key: 'prefab-residential',
                label: 'Houses / Residential',
                description: 'Card image for "Houses" prefab type (landscape, ~800×600)',
                defaultSrc: '/images/prefab-residential.svg',
            },
            {
                key: 'prefab-commercial',
                label: 'Offices & Commercial',
                description: 'Card image for "Offices & Commercial Spaces" prefab type',
                defaultSrc: '/images/prefab-commercial.svg',
            },
            {
                key: 'prefab-modular',
                label: 'Modular Units',
                description: 'Card image for "Modular Units" prefab type',
                defaultSrc: '/images/prefab-modular.svg',
            },
        ],
    },
    {
        title: '🌿 Benefits Section',
        items: [
            {
                key: 'benefits-image',
                label: 'Benefits / Future of Home Building',
                description: 'Square image in the "The Future of Home Building" section',
                defaultSrc: '',
            },
        ],
    },
    {
        title: '🖼 Featured Projects',
        items: [
            {
                key: 'featured-project-1',
                label: 'Modern Family Home',
                description: 'Featured project card — residential home (landscape, ~800×400)',
                defaultSrc: '',
            },
            {
                key: 'featured-project-2',
                label: 'Tech Startup Office',
                description: 'Featured project card — commercial office (landscape, ~800×400)',
                defaultSrc: '',
            },
        ],
    },
    {
        title: '🎠 3D Gallery Carousel',
        items: [
            {
                key: 'gallery-1',
                label: 'Gallery: Modern Family Home',
                description: 'Gallery card 1 — Manila residential (portrait, ~380×250)',
                defaultSrc: '',
            },
            {
                key: 'gallery-2',
                label: 'Gallery: Tech Startup Office',
                description: 'Gallery card 2 — Cebu commercial',
                defaultSrc: '',
            },
            {
                key: 'gallery-3',
                label: 'Gallery: Coastal Villa',
                description: 'Gallery card 3 — Batangas residential',
                defaultSrc: '',
            },
            {
                key: 'gallery-4',
                label: 'Gallery: Eco-Friendly Home',
                description: 'Gallery card 4 — Tagaytay residential',
                defaultSrc: '',
            },
            {
                key: 'gallery-5',
                label: 'Gallery: Medical Clinic',
                description: 'Gallery card 5 — Quezon City commercial',
                defaultSrc: '',
            },
        ],
    },
    {
        title: '📋 Project Scroller Cards',
        items: [
            {
                key: 'project-coastal-villa',
                label: 'Coastal Villa',
                description: 'Project scroller — Batangas residential',
                defaultSrc: '',
            },
            {
                key: 'project-eco-home',
                label: 'Eco-Friendly Home',
                description: 'Project scroller — Tagaytay residential',
                defaultSrc: '',
            },
            {
                key: 'project-medical-clinic',
                label: 'Medical Clinic',
                description: 'Project scroller — Quezon City commercial',
                defaultSrc: '',
            },
            {
                key: 'project-resort-cottages',
                label: 'Resort Cottages',
                description: 'Project scroller — Palawan modular',
                defaultSrc: '',
            },
            {
                key: 'project-student-dorm',
                label: 'Student Dormitory',
                description: 'Project scroller — Baguio modular',
                defaultSrc: '',
            },
            {
                key: 'project-retail-space',
                label: 'Retail Space',
                description: 'Project scroller — Makati commercial',
                defaultSrc: '',
            },
        ],
    },
];

const STORAGE_KEY = 'qhp_image_urls';

export function getStoredImageUrl(key: string, defaultSrc: string): string {
    try {
        // 1. Check LocalStorage (Admin Override / Dev Mode)
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const urls = JSON.parse(stored);
            if (urls[key] && urls[key].trim() !== '') {
                return urls[key];
            }
        }
        // 2. Check Static Config (Deployed Content)
        // @ts-ignore - JSON import might have type issues depending on config, but runtime works
        const config = siteConfig as Record<string, string>;
        if (config[key] && config[key].trim() !== '') {
            return config[key];
        }
    } catch {
        // ignore parse errors
    }
    return defaultSrc;
}

export function hasStoredImage(key: string): boolean {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const urls = JSON.parse(stored);
            if (urls[key] && urls[key].trim() !== '') {
                return true;
            }
        }
        // Check config
        const config = siteConfig as Record<string, string>;
        if (config[key] && config[key].trim() !== '') {
            return true;
        }
    } catch {
        // ignore
    }
    return false;
}

export default function AdminPanel() {
    const [urls, setUrls] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);
    const [previewKey, setPreviewKey] = useState<string | null>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setUrls(JSON.parse(stored));
            }
        } catch {
            // ignore
        }
    }, []);

    const handleChange = (key: string, value: string) => {
        setUrls((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleClear = (key: string) => {
        setUrls((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setSaved(false);
    };

    const handleClearAll = () => {
        setUrls({});
        localStorage.removeItem(STORAGE_KEY);
        setSaved(false);
    };

    const handleExport = () => {
        // Combine current local edits with existing config (local takes precedence)
        const exportData = { ...(siteConfig as Record<string, string>), ...urls };
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'siteConfig.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const toggleGroup = (title: string) => {
        setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const goToSite = () => {
        window.location.hash = '';
        window.location.reload();
    };

    const totalImages = IMAGE_GROUPS.reduce((acc, g) => acc + g.items.length, 0);
    const setImages = Object.values(urls).filter((v) => v && v.trim() !== '').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToSite}
                            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium hidden sm:inline">Back to Site</span>
                        </button>
                        <div className="h-6 w-px bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg">
                                <Image size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-lg leading-tight">Image Manager</h1>
                                <p className="text-blue-300 text-xs">{setImages} / {totalImages} images set</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Reset All</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
                            title="Download config file for deployment"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export Config</span>
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg transition-all transform hover:scale-105 active:scale-95 ${saved
                                ? 'bg-green-500 text-white shadow-green-500/30'
                                : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-teal-500/30'
                                }`}
                        >
                            {saved ? <CheckCircle size={18} /> : <Save size={18} />}
                            {saved ? 'Saved!' : 'Save All'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-xl p-5 mb-8 backdrop-blur-sm">
                    <p className="text-blue-200 text-sm leading-relaxed">
                        <strong className="text-teal-300">How it works:</strong> Changes are saved to your browser locally.
                        <br />
                        <strong className="text-yellow-300">For Deployment:</strong> To apply changes to the live site, click <strong className="text-white">"Export Config"</strong>, replacing the file at <code className="bg-black/30 px-1 rounded">src/config/siteConfig.json</code> before deploying.
                    </p>
                </div>

                {/* Image Groups */}
                <div className="space-y-6">
                    {IMAGE_GROUPS.map((group) => {
                        const isCollapsed = collapsedGroups[group.title];
                        const groupSetCount = group.items.filter((item) => urls[item.key]?.trim()).length;

                        return (
                            <div key={group.title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-white font-bold text-base sm:text-lg">{group.title}</h2>
                                        <span className="text-xs font-medium text-blue-300/60 bg-white/5 px-2 py-0.5 rounded-full">
                                            {groupSetCount}/{group.items.length} set
                                        </span>
                                    </div>
                                    {isCollapsed ? (
                                        <ChevronDown size={20} className="text-blue-300" />
                                    ) : (
                                        <ChevronUp size={20} className="text-blue-300" />
                                    )}
                                </button>

                                {/* Group Items */}
                                {!isCollapsed && (
                                    <div className="border-t border-white/5">
                                        {group.items.map((slot) => {
                                            const currentUrl = urls[slot.key] || '';
                                            const displaySrc = currentUrl.trim() !== '' ? currentUrl : slot.defaultSrc;
                                            const isCustom = currentUrl.trim() !== '';
                                            const hasDefault = slot.defaultSrc !== '';

                                            return (
                                                <div
                                                    key={slot.key}
                                                    className="px-5 sm:px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                        {/* Preview Thumbnail */}
                                                        <div className="relative flex-shrink-0">
                                                            <div
                                                                className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-teal-400/50 transition-all"
                                                                onClick={() => setPreviewKey(previewKey === slot.key ? null : slot.key)}
                                                            >
                                                                {displaySrc ? (
                                                                    <img
                                                                        src={displaySrc}
                                                                        alt={slot.label}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-teal-700/50">
                                                                        <Image size={28} className="text-white/30" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isCustom && (
                                                                <div className="absolute top-2 right-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                                                    SET
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Form */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-white font-semibold text-sm">{slot.label}</h3>
                                                            <p className="text-blue-300/60 text-xs mt-0.5 mb-3">{slot.description}</p>

                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="url"
                                                                    value={currentUrl}
                                                                    onChange={(e) => handleChange(slot.key, e.target.value)}
                                                                    placeholder={hasDefault ? 'Paste URL to override default...' : 'Paste image URL here...'}
                                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-blue-300/30 focus:outline-none focus:border-teal-400/60 focus:ring-1 focus:ring-teal-400/30 transition-all text-sm font-mono"
                                                                />
                                                                <button
                                                                    onClick={() => setPreviewKey(previewKey === slot.key ? null : slot.key)}
                                                                    className="flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-blue-300 hover:text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                                                    title="Preview"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                {isCustom && (
                                                                    <button
                                                                        onClick={() => handleClear(slot.key)}
                                                                        className="flex-shrink-0 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-300 hover:text-red-200 w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                                                        title="Remove custom URL"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Preview */}
                                                    {previewKey === slot.key && displaySrc && (
                                                        <div className="mt-4 rounded-xl overflow-hidden bg-black/20 p-4">
                                                            <img
                                                                src={displaySrc}
                                                                alt={`Preview: ${slot.label}`}
                                                                className="w-full max-h-80 object-contain rounded-lg"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                            <p className="text-blue-300/50 text-xs mt-2 text-center truncate">
                                                                {isCustom ? currentUrl : `Default: ${slot.defaultSrc}`}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Action */}
                <div className="mt-10 flex flex-col items-center gap-4">
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base shadow-xl transition-all transform hover:scale-105 active:scale-95 ${saved
                            ? 'bg-green-500 text-white shadow-green-500/30'
                            : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-teal-500/30'
                            }`}
                    >
                        {saved ? <CheckCircle size={20} /> : <Save size={20} />}
                        {saved ? 'All Changes Saved!' : 'Save All Changes'}
                    </button>
                    <p className="text-blue-300/40 text-xs">
                        Images are stored in your browser's local storage
                    </p>
                </div>
            </main>
        </div>
    );
}
