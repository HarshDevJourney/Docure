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

const PatientOnboardForm1 = ({ form } : { form: UseFormReturn<BasicInfoFormData> }) => {
  return (

      <div className="grid md:grid-cols-2 px-3 pb-2 pt-1 gap-5 ">

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Phone Number
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

        {/* DOB */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Date of Birth
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="h-10 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Gender
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} >
                <FormControl>
                  <SelectTrigger className="h-14 w-full rounded-lg border border-gray-300 focus:ring-0 focus:ring-gray-100">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className=' bg-white/80'>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Blood Group */}
        <FormField
          control={form.control}
          name="bloodGrp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Blood Group (Optional)
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-14 w-full rounded-lg  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100">
                    <SelectValue placeholder="Blood group" className="text-gray-400" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-30 overflow-y-auto bg-white/80">
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />
      </div>

  );
};

export default PatientOnboardForm1;
