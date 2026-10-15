"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cdn } from "@/lib/cdn";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface Photo {
    id: number; imagePath: string | null; title: string | null;
}

interface Props { universityName: string; photos: Photo[]; }

export default function UniversityGallery({ universityName, photos }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    
    const goPrev = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? photos.length - 1 : prev - 1) : null));
    }, [photos.length]);
    
    const goNext = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setLightboxIndex((prev) => (prev !== null ? (prev === photos.length - 1 ? 0 : prev + 1) : null));
    }, [photos.length]);

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, closeLightbox, goPrev, goNext]);

    if (photos.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Campus Gallery</h2>
                    <p className="text-lg text-gray-600">A glimpse into life at {universityName}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {photos.map((photo, index) => (
                        <div 
                            key={photo.id} 
                            onClick={() => photo.imagePath && openLightbox(index)}
                            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 bg-white transition-all duration-300 ${photo.imagePath ? 'cursor-pointer' : ''}`}
                        >
                            {photo.imagePath ? (
                                <>
                                    <Image
                                        src={cdn(photo.imagePath) || ""}
                                        alt={photo.title || "Campus"}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 text-gray-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-md">
                                            <Maximize2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm bg-gray-50">
                                    <Maximize2 className="w-8 h-8 opacity-20 mb-2" />
                                    <span>No image</span>
                                </div>
                            )}
                            {photo.title && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                                    <p className="text-white text-sm font-medium p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {photo.title}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Popup Modal */}
            {lightboxIndex !== null && photos[lightboxIndex]?.imagePath && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center backdrop-blur-sm p-4 sm:p-8"
                    onClick={closeLightbox}
                >
                    {/* The popup container */}
                    <div 
                        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-5xl w-full max-h-full"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        {/* Top Bar inside the popup */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{photos[lightboxIndex].title || universityName}</h3>
                                <p className="text-xs text-gray-500">Image {lightboxIndex + 1} of {photos.length}</p>
                            </div>
                            <button 
                                onClick={closeLightbox}
                                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Main Image Container */}
                        <div className="relative w-full aspect-video sm:aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden">
                            <Image
                                src={cdn(photos[lightboxIndex].imagePath) || ""}
                                alt={photos[lightboxIndex].title || "Campus enlarged"}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                priority
                            />

                            {/* Navigation Buttons */}
                            {photos.length > 1 && (
                                <>
                                    <button 
                                        onClick={goPrev}
                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md p-2 rounded-full transition-all group border border-gray-200"
                                    >
                                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                                    </button>
                                    <button 
                                        onClick={goNext}
                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md p-2 rounded-full transition-all group border border-gray-200"
                                    >
                                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
