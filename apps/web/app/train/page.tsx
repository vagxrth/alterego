import React from 'react'
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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

const page = () => {
    return (
        <div className='flex items-center justify-center min-h-screen py-8'>
            <Card className="w-[450px] max-w-[95vw]">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of the model" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="type">Type</Label>
                                <Select>
                                    <SelectTrigger id='type'>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="man">Man</SelectItem>
                                        <SelectItem value="woman">Woman</SelectItem>
                                        <SelectItem value="others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" placeholder="Age of the model" />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Label htmlFor="ethinicity">Ethinicity</Label>
                                <Select>
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
                                <Label htmlFor="eyecolor">Eye Color</Label>
                                <Select>
                                    <SelectTrigger id='eyecolor'>
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
                                <Switch id="bald" />
                            </div>
                            
                            <div className="mt-2">
                                <ImageUpload />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Model</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default page