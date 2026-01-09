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
import { UseFormReturn } from "react-hook-form";
import { BasicInfoFormData } from "./onboardPatient";


const patientOnboardForm2 = ({ form } : { form: UseFormReturn<BasicInfoFormData> }) => {
  return (
    <div className="grid grid-cols-1 px-3 py-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">


        {/* CONTACT NAME */}
        <FormField
          control={form.control}
          name="emergencyContact.name"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Contact Name
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
        </div>

        {/* CONTACT NUMBER */}
        <FormField
          control={form.control}
          name="emergencyContact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Contact Phone
              </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+91 9876543210"
                    className="h-10 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                    {...field}
                    />
                </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Relationship */}
        <FormField
        control={form.control}
        name="emergencyContact.relation"
        render={({ field }) => (
            <FormItem>
            <FormLabel className="text-sm font-medium text-gray-600">
                Relationship
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

                <SelectContent className=' bg-white/80' side="bottom"
                    align="start"
                    sideOffset={8}
                    avoidCollisions={false}>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>

            <FormMessage className="text-red-400 text-xs" />
            </FormItem>
        )}
        />

      </div>
  )
}

export default patientOnboardForm2