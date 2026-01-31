import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { healthcareCategories, healthcareCategoriesList } from "@/lib/constant";
import { Checkbox } from "../ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { BasicDocInfoFormData } from "./onboardDoctor";


const doctorOnboardForm1 = ({ form } : { form : UseFormReturn<BasicDocInfoFormData>}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 px-4 py-6 items-start md:grid-cols-2 gap-6">

        {/* Medical Specialization */}
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                Medical Specialization
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="
                      h-11 w-full rounded-lg
                      border border-gray-300
                      bg-white
                      hover:border-blue-400
                      focus:outline-none
                      focus:ring-1
                      focus:ring-blue-500
                      focus:border-blue-500
                      data-[state=open]:border-blue-500
                      data-[state=open]:ring-1
                      data-[state=open]:ring-blue-500
                      transition-all
                    "
                  >
                    <SelectValue
                      placeholder="Select specialization"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent 
                  className="bg-white border border-gray-200 rounded-lg shadow-lg" 
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  avoidCollisions={false}
                >
                  <SelectItem value="cardiologist" className="cursor-pointer hover:bg-blue-50">
                    Cardiologist
                  </SelectItem>
                  <SelectItem value="dermatologist" className="cursor-pointer hover:bg-blue-50">
                    Dermatologist
                  </SelectItem>
                  <SelectItem value="orthopedic" className="cursor-pointer hover:bg-blue-50">
                    Orthopedic
                  </SelectItem>
                  <SelectItem value="pediatrician" className="cursor-pointer hover:bg-blue-50">
                    Pediatrician
                  </SelectItem>
                  <SelectItem value="neurologist" className="cursor-pointer hover:bg-blue-50">
                    Neurologist
                  </SelectItem>
                  <SelectItem value="gynecologist" className="cursor-pointer hover:bg-blue-50">
                    Gynecologist
                  </SelectItem>
                  <SelectItem value="general-physician" className="cursor-pointer hover:bg-blue-50">
                    General Physician
                  </SelectItem>
                  <SelectItem value="ent-specialist" className="cursor-pointer hover:bg-blue-50">
                    ENT Specialist
                  </SelectItem>
                  <SelectItem value="psychiatrist" className="cursor-pointer hover:bg-blue-50">
                    Psychiatrist
                  </SelectItem>
                  <SelectItem value="ophthalmologist" className="cursor-pointer hover:bg-blue-50">
                    Ophthalmologist
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />
        
        {/* Years of Experience */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                Years of Experience
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g., 5"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value === "") {
                      field.onChange(undefined);
                    } else {
                      const numValue = parseInt(value, 10);
                      if (numValue >= 0 && numValue <= 70) {
                        field.onChange(numValue);
                      }
                    }
                  }}
                  onBlur={field.onBlur}
                  className="
                    h-11 rounded-lg w-full
                    border border-gray-300
                    bg-white
                    hover:border-blue-400
                    focus:outline-none
                    focus:ring-1
                    focus:ring-blue-500
                    focus:border-blue-500
                    transition-all
                    text-gray-900
                    placeholder:text-gray-400
                  "
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />
        
        {/* Full Width Section */}
        <div className="md:col-span-2 space-y-6">

          {/* Healthcare Categories */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => {
              const values: string[] = field.value ?? [];

              return (
                <FormItem>
                  {/* Title */}
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Healthcare Categories
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-600 mb-3 mt-1">
                    Select all healthcare areas you provide services for
                  </p>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {healthcareCategoriesList.map((category) => {
                      const checked = values.includes(category);

                      return (
                        <label
                          key={category}
                          className={`
                            flex items-center gap-2.5 p-2.5 rounded-lg
                            transition-all cursor-pointer
                            ${checked 
                              ? 'bg-blue-50 border border-blue-300' 
                              : 'bg-white border border-gray-200 hover:border-blue-300'
                            }
                          `}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              if (isChecked) {
                                field.onChange([...values, category]);
                              } else {
                                field.onChange(values.filter((v) => v !== category));
                              }
                            }}
                          />

                          <span className="text-sm font-medium text-gray-700 select-none">
                            {category}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Error */}
                  <FormMessage className="text-red-500 text-xs mt-2" />
                </FormItem>
              );
            }}
          />

          {/* Qualification */}
          <FormField
            control={form.control}
            name="qualification"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Qualification
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g., MBBS, MD"
                    className="
                      h-11 rounded-lg w-full
                      border border-gray-300
                      bg-white
                      hover:border-blue-400
                      focus:outline-none
                      focus:ring-1
                      focus:ring-blue-500
                      focus:border-blue-500
                      transition-all
                      text-gray-900
                      placeholder:text-gray-400
                    "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          {/* About Yourself */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  About Yourself
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your medical background, expertise, and approach to patient care..."
                    className="
                      min-h-28 rounded-lg w-full
                      border border-gray-300
                      bg-white
                      hover:border-blue-400
                      focus:outline-none
                      focus:ring-1
                      focus:ring-blue-500
                      focus:border-blue-500
                      transition-all
                      text-gray-900
                      placeholder:text-gray-400
                      resize-none
                    "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          {/* Consultation Fees */}
          <FormField
            control={form.control}
            name="fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Consultation Fees (₹)
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      ₹
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="500"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value === "") {
                          field.onChange(undefined);
                        } else {
                          const numValue = parseInt(value, 10);
                          if (numValue >= 0) {
                            field.onChange(numValue);
                          }
                        }
                      }}
                      onBlur={field.onBlur}
                      className="
                        h-11 rounded-lg w-full pl-9
                        border border-gray-300
                        bg-white
                        hover:border-blue-400
                        focus:outline-none
                        focus:ring-1
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition-all
                        text-gray-900
                        placeholder:text-gray-400
                      "
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />
        </div>

      </div>
    </div>
  )
}

export default doctorOnboardForm1