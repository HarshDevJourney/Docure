import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { UseFormReturn } from 'react-hook-form'
import { BasicDocInfoFormData } from './onboardDoctor'

const doctorOnboardForm2 = ({ form } : { form : UseFormReturn<BasicDocInfoFormData>}) => {
  return (
    <div className='grid grid-cols-1 px-3 py-1 gap-5'>
        <FormField
            control={form.control}
            name="hospitalInfo.name"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                    Hospital / Clinic Name
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
          name="hospitalInfo.address"
          render={({ field }) => (
              <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Address
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="h-20 rounded-lg w-full  border border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-100"
                  {...field}
                  />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
          />

          <FormField
            control={form.control}
            name="hospitalInfo.cityName"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                    City Name
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

export default doctorOnboardForm2