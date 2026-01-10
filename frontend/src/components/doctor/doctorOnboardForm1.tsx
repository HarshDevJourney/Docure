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
    <div className="grid grid-cols-1 px-3 py-1 items-start md:grid-cols-2 gap-5">

        <FormField
        control={form.control}
        name="specialization"
        render={({ field }) => (
            <FormItem>
            <FormLabel className="text-sm font-medium text-gray-600">
                Medical Specialization
            </FormLabel>

            <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                <SelectTrigger
                    className="
                    h-14 w-full rounded-lg
                    border border-gray-300
                    focus:outline-none
                    focus:ring-0
                    focus:border-transparent
                    data-[state=open]:border-transparent
                    "
                >
                    <SelectValue
                    placeholder="Select relationship"
                    className="text-gray-400"
                    />
                </SelectTrigger>
                </FormControl>

                <SelectContent className=' bg-white' side="bottom"
                    align="start"
                    sideOffset={8}
                    avoidCollisions={false}>
                    <SelectItem value="cardiologist">Cardiologist</SelectItem>
                    <SelectItem value="dermatologist">Dermatologist</SelectItem>
                    <SelectItem value="orthopedic">Orthopedic</SelectItem>
                    <SelectItem value="pediatrician">Pediatrician</SelectItem>
                    <SelectItem value="neurologist">Neurologist</SelectItem>
                    <SelectItem value="gynecologist">Gynecologist</SelectItem>
                    <SelectItem value="general-physician">General Physician</SelectItem>
                    <SelectItem value="ent-specialist">ENT Specialist</SelectItem>
                    <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                    <SelectItem value="ophthalmologist">Ophthalmologist</SelectItem>
                </SelectContent>
            </Select>

            <FormMessage className="text-red-400 text-xs" />
            </FormItem>
        )}
        />
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Years of Experience 
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                  className="h-10 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                  />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
          />
        
        <div className="md:col-span-2 space-y-5">

            <FormField
                control={form.control}
                name="category"
                render={({ field }) => {
                  const values: string[] = field.value ?? [];

                  return (
                    <FormItem>
                      {/* Title */}
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Healthcare Categories
                      </FormLabel>

                      {/* Subtitle */}
                      <p className="text-xs text-gray-500 mb-3">
                        Select all healthcare areas you provide services for:
                      </p>

                      {/* Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {healthcareCategoriesList.map((category) => {
                          const checked = values.includes(category);

                          return (
                            <div
                              key={category}
                              className="flex items-center gap-3 h-7"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(isChecked) => {
                                  if (isChecked) {
                                    field.onChange([...values, category]);
                                  } else {
                                    field.onChange(
                                      values.filter((v) => v !== category)
                                    );
                                  }
                                }}
                              />

                              <span className="text-xs font-semibold text-gray-700 cursor-pointer">
                                {category}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Error */}
                      <FormMessage className="text-red-500 text-xs mt-2" />
                    </FormItem>
                  );
                }}
              />



                <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">
                        Qualification
                    </FormLabel>
                    <FormControl>
                        <Input
                        type="text"
                        className="h-10 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                </FormItem>
            )}
            />

          <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                About Yourself
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="h-30 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                  {...field}
                  />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name="fees"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Consultation Fees
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                  className="h-10 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                  
                  />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
          />
        </div>


      </div>
  )
}

export default doctorOnboardForm1