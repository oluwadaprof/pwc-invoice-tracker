import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save, Pencil, Edit2 } from "lucide-react"
import { Button } from "@/src/primitives/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/src/primitives/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/primitives/ui/form"
import { Input } from "@/src/primitives/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/primitives/ui/select"
import { Textarea } from "@/src/primitives/ui/textarea"

import { useState, useEffect } from "react"
import type { Product } from "../../types/product"
import { useCustomProductsStore } from "../../store/use-custom-product-store"
import { customProductSchema, type CustomProductFormData } from "../../utils/custom-schema"
import { DropdownMenuItem } from "@/src/primitives/ui/dropdown-menu"

type AddCustomProductDialogProps = {
    categories: string[]
    editProduct?: Product
    onSuccess?: () => void
}

export const AddCustomProductDialog = ({ categories, editProduct, onSuccess }: AddCustomProductDialogProps) => {
    const [open, setOpen] = useState(false)
    const { addCustomProduct, updateCustomProduct } = useCustomProductsStore()

    const form = useForm<CustomProductFormData>({
        resolver: zodResolver(customProductSchema),
        mode: "onChange",
        defaultValues: {
            name: editProduct?.name || "",
            category: editProduct?.category || "",
            basePrice: editProduct?.basePrice?.toString() || "",
            vatRate: editProduct?.vatRate?.toString() || "",
            description: editProduct?.description || "",
        },
    })

    const selectedCategory = form.watch("category")

    useEffect(() => {
        if (selectedCategory === "Zero-Rated" || selectedCategory === "Exempt") {
            form.setValue("vatRate", "0", { shouldValidate: true })
        }
    }, [selectedCategory, form])

    const isVatDisabled = selectedCategory === "Zero-Rated" || selectedCategory === "Exempt"

    const onSubmit = (data: CustomProductFormData) => {
        const productData = {
            name: data.name,
            category: data.category,
            basePrice: Number(data.basePrice),
            vatRate: Number(data.vatRate),
            description: data.description,
        }

        if (editProduct) {
            updateCustomProduct(editProduct.id, productData)
        } else {
            addCustomProduct(productData)
        }

        form.reset()
        setOpen(false)
        onSuccess?.()
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {editProduct ? (
                    <Button variant="ghost" size="icon" className=" justify-start h-7 w-full mb-1">
                        <Edit2 className="h-4 w-4 mr-2 ml-2" /> <span>Edit Service</span>
                    </Button>
                ) : (
                    <Button size="sm" className="rounded-xl gap-2">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Custom Service</span>
                        <span className="sm:hidden">Add Service</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editProduct ? "Edit Custom Service" : "Add Custom VAT Service"}</DialogTitle>
                    <DialogDescription>
                        {editProduct ? "Update your custom service details below." : "Create a new custom VAT service for your calculations."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Web Development" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='rounded-xl'>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='rounded-xl' >
                                            {categories.map((category) => (
                                                <SelectItem className="rounded-lg" key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="basePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₦)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="vatRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VAT Rate (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="7.5"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                disabled={isVatDisabled}
                                                className={isVatDisabled ? "bg-muted cursor-not-allowed" : ""}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your service..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={!form.formState.isValid}
                                className="w-full sm:w-auto"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {editProduct ? "Update Service" : "Create Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}