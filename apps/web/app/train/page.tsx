"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TrainModelSchema } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, User, X, ImageIcon } from "lucide-react";
import axios from "axios";
import JSZip from "jszip";
import { useAuth } from "@clerk/nextjs";

type TrainModelFormValues = z.infer<typeof TrainModelSchema>;

const TrainPage = () => {
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [zipUrl, setZipUrl] = useState<string>("");

    const { getToken } = useAuth();

    const form = useForm<TrainModelFormValues>({
        resolver: zodResolver(TrainModelSchema),
        defaultValues: {
            name: "",
            type: "Male",
            age: 18,
            ethnicity: "Other",
            eyeColor: "Brown",
            bald: false,
            zipUrl: "",
        },
    });

    // Effect to manage object URLs and cleanup
    useEffect(() => {
        // Revoke previous URLs
        imageUrls.forEach(url => URL.revokeObjectURL(url));

        // Create new URLs for uploaded images
        const newUrls = uploadedImages.map(file => URL.createObjectURL(file));
        setImageUrls(newUrls);

        // Cleanup function to revoke URLs when component unmounts or uploadedImages change
        return () => {
            newUrls.forEach(url => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedImages]);

    const handleImageUpload = async (files: FileList | null) => {
        if (!files) return;

        const imageFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        const newImages = [...uploadedImages, ...imageFiles];
        setUploadedImages(newImages);

        // Automatically zip and upload when images are selected
        if (newImages.length > 0) {
            await zipAndUploadImages(newImages);
        }
    };

    const zipAndUploadImages = async (images: File[]) => {
        setIsUploading(true);
        
        try {
            const zip = new JSZip();
            
            const BACKEND_URL = "http://localhost:8080";
            const res = await axios.get(`${BACKEND_URL}/pre-sign`);
            const presignedUrl = res.data.url;

            for (const file of images) {
                const content = await file.arrayBuffer();
                zip.file(file.name, content);
            }

            const content = await zip.generateAsync({ type: "blob" });
            
            await axios.put(presignedUrl, content);

            const urlWithoutQuery = presignedUrl.split('?')[0];
            const urlParts = urlWithoutQuery.split('/');
            const modelsIndex = urlParts.findIndex((part: string) => part === 'models');
            if (modelsIndex !== -1) {
                const pathAfterBucket = urlParts.slice(modelsIndex).join('/');
                const publicUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}/${pathAfterBucket}`;
                setZipUrl(publicUrl);
                form.setValue('zipUrl', publicUrl);
            } else {
                const uploadedZipUrl = urlWithoutQuery;
                setZipUrl(uploadedZipUrl);
                form.setValue('zipUrl', uploadedZipUrl);
            }

        } catch (error) {
            console.error("Error uploading images:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = async (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        
        if (newImages.length > 0) {
            await zipAndUploadImages(newImages);
        } else {
            setZipUrl("");
            form.setValue('zipUrl', "");
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    const onSubmit = async(data: TrainModelFormValues) => {
        const token = await getToken();
        if (!token) {
            console.error("User not authenticated!");
            return;
        }
        const response = await axios.post(`http://localhost:8080/model/train`, {
            name: data.name,
            type: data.type,
            age: data.age,
            ethnicity: data.ethnicity,
            eyeColor: data.eyeColor,
            bald: data.bald,
            zipUrl: data.zipUrl,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        )
        console.log("Response:", response);
        console.log("Training model with data:", data);
        console.log("Uploaded images:", uploadedImages);
        // TODO: Implement actual model training API call with images
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        Train Your AI Model
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Create a personalized AI model by providing detailed characteristics.
                        Upload your training data and let our algorithms learn your unique features.
                    </p>
                </div>

                {/* Main Form Card */}
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                            <User className="w-6 h-6" />
                            Model Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Basic Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">
                                                        Model Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter a unique name for your model"
                                                            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Type Field */}
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">
                                                        Gender
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20">
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-gray-800 border-gray-700">
                                                            <SelectItem value="Male" className="text-white focus:bg-gray-700">Male</SelectItem>
                                                            <SelectItem value="Female" className="text-white focus:bg-gray-700">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Age Field */}
                                        <FormField
                                            control={form.control}
                                            name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">
                                                        Age
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            placeholder="Enter age"
                                                            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                field.onChange(value === '' ? undefined : Number(value));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Ethnicity Field */}
                                        <FormField
                                            control={form.control}
                                            name="ethnicity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">
                                                        Ethnicity
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20">
                                                                <SelectValue placeholder="Select ethnicity" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-gray-800 border-gray-700">
                                                            <SelectItem value="White" className="text-white focus:bg-gray-700">White</SelectItem>
                                                            <SelectItem value="Black" className="text-white focus:bg-gray-700">Black</SelectItem>
                                                            <SelectItem value="AsianAmerican" className="text-white focus:bg-gray-700">Asian American</SelectItem>
                                                            <SelectItem value="EastAsian" className="text-white focus:bg-gray-700">East Asian</SelectItem>
                                                            <SelectItem value="Indian" className="text-white focus:bg-gray-700">Indian</SelectItem>
                                                            <SelectItem value="Hispanic" className="text-white focus:bg-gray-700">Hispanic</SelectItem>
                                                            <SelectItem value="MiddleEastern" className="text-white focus:bg-gray-700">Middle Eastern</SelectItem>
                                                            <SelectItem value="Other" className="text-white focus:bg-gray-700">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Physical Features Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                                        Physical Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Eye Color Field */}
                                        <FormField
                                            control={form.control}
                                            name="eyeColor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">
                                                        Eye Color
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20">
                                                                <SelectValue placeholder="Select eye color" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-gray-800 border-gray-700">
                                                            <SelectItem value="Brown" className="text-white focus:bg-gray-700">Brown</SelectItem>
                                                            <SelectItem value="Blue" className="text-white focus:bg-gray-700">Blue</SelectItem>
                                                            <SelectItem value="Green" className="text-white focus:bg-gray-700">Green</SelectItem>
                                                            <SelectItem value="Hazel" className="text-white focus:bg-gray-700">Hazel</SelectItem>
                                                            <SelectItem value="Gray" className="text-white focus:bg-gray-700">Gray</SelectItem>
                                                            <SelectItem value="Other" className="text-white focus:bg-gray-700">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Bald Checkbox */}
                                        <FormField
                                            control={form.control}
                                            name="bald"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-gray-700 bg-gray-800/30 p-4 h-fit">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-white cursor-pointer">
                                                        Bald
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Training Data Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
                                        Training Data
                                    </h3>
                                    {/* Image Upload Field */}
                                    <div>
                                        <FormLabel className="text-white mb-3 block">
                                            Training Images
                                        </FormLabel>

                                        {/* Upload Area */}
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-gray-600 bg-gray-800/30'
                                                }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e.target.files)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            <div className="text-center">
                                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                <div className="text-white font-medium mb-2">
                                                    Drop images here or click to upload
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    Support for multiple images (JPG, PNG, GIF)
                                                </div>
                                            </div>
                                        </div>

                                        {/* Uploaded Images Preview */}
                                        {uploadedImages.length > 0 && (
                                            <div className="mt-4">
                                                <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
                                                    Uploaded Images ({uploadedImages.length})
                                                    {isUploading && (
                                                        <span className="text-purple-400 text-xs">
                                                            Uploading...
                                                        </span>
                                                    )}
                                                    {zipUrl && !isUploading && (
                                                        <span className="text-green-400 text-xs">
                                                            ✓ Ready for training
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {uploadedImages.map((file, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                                                                {imageUrls[index] && (
                                                                    <Image
                                                                        src={imageUrls[index]}
                                                                        alt={`Upload ${index + 1}`}
                                                                        fill
                                                                        className="object-cover"
                                                                        unoptimized
                                                                    />
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            <div className="text-xs text-gray-400 mt-1 truncate">
                                                                {file.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-6 gap-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Start Training Model
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TrainPage;