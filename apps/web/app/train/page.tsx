'use client'

import React, { useState } from 'react'
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { Switch } from '../../components/ui/switch'
import { ImageUpload } from '../../components/ImageUpload'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useRouter } from 'next/navigation'
import { TrainModelInput, PersonTypeValues, EthnicityTypeValues, EyeColorTypeValues } from '../../../../packages/schema/inferred-types'

const TrainPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        type: 'Man' as PersonTypeValues,
        age: 25,
        ethinicity: 'White' as EthnicityTypeValues,
        eyeColor: 'Brown' as EyeColorTypeValues,
        bald: false,
        zipURL: '',
        zipKey: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'age') {
            setFormData(prev => ({ ...prev, [id]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSelectChange = (id: string, value: string) => {
        if (id === 'type') {
            // Map UI values to schema values
            const typeMap: Record<string, PersonTypeValues> = {
                'man': 'Man',
                'woman': 'Woman',
                'others': 'Other'
            };
            const mappedValue = typeMap[value] || 'Man';
            setFormData(prev => ({ ...prev, [id]: mappedValue }));
        } else if (id === 'ethinicity') {
            // Map UI values to schema values
            const ethnicityMap: Record<string, EthnicityTypeValues> = {
                'white': 'White',
                'black': 'Black',
                'american': 'American',
                'indian': 'Indian',
                'eastasian': 'EastAsian'
            };
            const mappedValue = ethnicityMap[value] || 'White';
            setFormData(prev => ({ ...prev, [id]: mappedValue }));
        } else if (id === 'eyeColor') {
            // Map UI values to schema values
            const eyeColorMap: Record<string, EyeColorTypeValues> = {
                'brown': 'Brown',
                'black': 'Black',
                'hazel': 'Hazel',
                'blue': 'Blue',
                'green': 'Green',
                'gray': 'Gray'
            };
            const mappedValue = eyeColorMap[value] || 'Brown';
            setFormData(prev => ({ ...prev, [id]: mappedValue }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, bald: checked }));
    };

    const handleZipUploaded = (zipUrl: string, zipKey: string) => {
        setFormData(prev => ({ 
            ...prev, 
            zipURL: zipUrl,
            zipKey: zipKey
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.zipURL) {
            alert('Please fill in all required fields and upload images');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            const trainModelInput: TrainModelInput = {
                name: formData.name,
                type: formData.type,
                age: formData.age,
                ethinicity: formData.ethinicity,
                eyeColor: formData.eyeColor,
                bald: formData.bald,
                zipURL: formData.zipURL
            };
            
            await axios.post(`${BACKEND_URL}/train`, trainModelInput);
            
            // Redirect to model page or dashboard
            alert('Model training started successfully!');
            router.push('/models'); // Adjust this to your app's routing
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen py-8'>
            <Card className="w-[450px] max-w-[95vw]">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Name of the model" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="type">Type</Label>
                                <Select onValueChange={(value) => handleSelectChange('type', value)}>
                                    <SelectTrigger id='type'>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="man">Man</SelectItem>
                                        <SelectItem value="woman">Woman</SelectItem>
                                        <SelectItem value="others">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="age">Age</Label>
                                <Input 
                                    id="age" 
                                    type="number"
                                    placeholder="Age of the model" 
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor="ethinicity">Ethinicity</Label>
                                <Select onValueChange={(value) => handleSelectChange('ethinicity', value)}>
                                    <SelectTrigger id='ethinicity'>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="white">White</SelectItem>
                                        <SelectItem value="black">Black</SelectItem>
                                        <SelectItem value="american">American</SelectItem>
                                        <SelectItem value="indian">Indian</SelectItem>
                                        <SelectItem value="eastasian">East Asian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor="eyeColor">Eye Color</Label>
                                <Select onValueChange={(value) => handleSelectChange('eyeColor', value)}>
                                    <SelectTrigger id='eyeColor'>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="brown">Brown</SelectItem>
                                        <SelectItem value="black">Black</SelectItem>
                                        <SelectItem value="hazel">Hazel</SelectItem>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="gray">Gray</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex items-center justify-between'>
                                <Label htmlFor="bald" className="cursor-pointer">Bald</Label>
                                <Switch 
                                    id="bald" 
                                    checked={formData.bald}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </div>
                            
                            <div className="mt-2">
                                <ImageUpload 
                                    onImagesUpload={setUploadedFiles}
                                    onZipUploaded={handleZipUploaded}
                                    maxImages={10}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <Button type="button" variant="outline">Cancel</Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting || !formData.zipURL}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Model'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default TrainPage