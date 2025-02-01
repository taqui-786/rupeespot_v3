"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  brands: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  sortBy: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  rating: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  discounts: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

interface FilterFormProps {
  myState: (data: FormData) => void;
  defaultValue: FormData;
  isFiltering: (value: boolean) => void;
  storeOpitions: Array<{ id: string; label: string }>;
}

const discounts = [
  { id: "0", label: "Above 0% " },
  { id: "50", label: "Above 50%" },
  { id: "60", label: "Above 60%" },
  { id: "70", label: "Above 70%" },
  { id: "80", label: "Above 80%" },
  { id: "90", label: "Above 90%" },
];

const sortBy = [
  { id: "all", label: "All" },
  { id: "highTolow", label: "High To Low" },
  { id: "lowTohigh", label: "Low To High" },
];

const rating = [
  { id: "all", label: "All" },
  { id: "0.0", label: "unrated" },
  { id: "3.0", label: "3+" },
  { id: "4.0", label: "4+" },
  { id: "5.0", label: "5.0" },
];

interface CheckboxGroupProps {
  name: keyof FormData;
  label: string;
  options: Array<{ id: string; label: string }>;
  form: UseFormReturn<FormData>;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ name, label, options, form }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-2">
            <FormLabel className="text-base font-bold">{label}</FormLabel>
          </div>
          <div className={ `w-full flex  items-start justify-start gap-4 ${name === 'sortBy' || name === 'brands' ?  'flex-col' : 'flex-wrap'}`}>
            {options.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem
                    key={item.id}
                    className={cn("flex flex-row items-center space-x-2 space-y-0")}
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, item.id]
                            : field.value.filter((value) => value !== item.id);
                          
                          if (name === 'brands' && item.id === 'all') {
                            field.onChange(checked ? ['all'] : []);
                          } else if (name === 'discounts' && item.id === '0') {
                            field.onChange(checked ? ['0'] : []);
                          } else if (['sortBy', 'rating'].includes(name)) {
                            field.onChange(checked ? [item.id] : []);
                          } else {
                            field.onChange(newValue.filter((value) => value !== 'all' && value !== '0'));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal capitalize">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FilterForm: React.FC<FilterFormProps> = ({
  myState,
  defaultValue,
  isFiltering,
  storeOpitions,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValue,
  });

  const onSubmit = (data: FormData) => {
    isFiltering(true);
    myState(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <CheckboxGroup name="brands" label="Stores" options={storeOpitions} form={form} />
        <CheckboxGroup name="discounts" label="Discounts" options={discounts} form={form} />
        <CheckboxGroup name="sortBy" label="Sort By" options={sortBy} form={form} />
        <CheckboxGroup name="rating" label="Rating" options={rating} form={form} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FilterForm;