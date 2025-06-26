"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TrainModelSchema } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Sparkles, User, Palette, Eye, Calendar, Globe } from "lucide-react";

type TrainModelFormValues = z.infer<typeof TrainModelSchema>;

const TrainPage = () => {
    const form = useForm<TrainModelFormValues>({
        resolver: zodResolver(TrainModelSchema),
        defaultValues: {
            name: "",
            type: "Male",
            age: 25,
            ethnicity: "Other",
            eyeColor: "Brown",
            bald: false,
            zipUrl: "",
        },
    });

    const onSubmit = (data: TrainModelFormValues) => {
        console.log("Training model with data:", data);
        // TODO: Implement actual model training API call
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
                        Upload your training data and let our advanced algorithms learn your unique features.
                    </p>
                </div>

                {/* Main Form Card */}
                <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                            <User className="w-6 h-6" />
                            Model Configuration
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Fill in the details below to configure your personalized AI model
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    <User className="w-4 h-4" />
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
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    <User className="w-4 h-4" />
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
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
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
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
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

                                    {/* Eye Color Field */}
                                    <FormField
                                        control={form.control}
                                        name="eyeColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    <Eye className="w-4 h-4" />
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

                                    {/* Training Data URL Field */}
                                    <FormField
                                        control={form.control}
                                        name="zipUrl"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    Training Data URL
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="url"
                                                        placeholder="https://example.com/training-data.zip"
                                                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Bald Checkbox */}
                                <FormField
                                    control={form.control}
                                    name="bald"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 bg-gray-800/30 p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-white flex items-center gap-2">
                                                    Bald
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <div className="flex justify-center pt-6">
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

                {/* Info Section */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Training typically takes 15-30 minutes depending on the complexity and number of images.
                        You'll receive an email notification when your model is ready.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrainPage;