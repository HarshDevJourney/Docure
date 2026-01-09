import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { UseFormReturn } from 'react-hook-form'
import { BasicInfoFormData } from './onboardPatient'

const patientOnboardForm3 = ({ form } : { form: UseFormReturn<BasicInfoFormData> }) => {
  return (
    <div className="grid grid-cols-1 px-3 py-1 gap-5">
        <FormField
          control={form.control}
          name="medicalHistory.allergies"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Known Allergies
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
          name="medicalHistory.currentMedications"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Current Medications
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
          name="medicalHistory.chronicConditions"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Chronics Conditions
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
  )
}

export default patientOnboardForm3