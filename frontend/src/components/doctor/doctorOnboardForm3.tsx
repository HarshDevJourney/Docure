import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { days } from './../../lib/constant'
import { Checkbox } from '../ui/checkbox'

const doctorOnboardForm3 = ({ form }) => {
  return (
    <div className="grid grid-cols-1 px-3 py-1 md:grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="avaliableFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Avaliable From
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

        <FormField
          control={form.control}
          name="avaliableUntil"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Avaliable Until
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

        <FormField
          control={form.control}
          name="appointmentSlotDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Appointment Slot Duration
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} >
                <FormControl>
                  <SelectTrigger className="h-14 w-full rounded-lg border border-gray-300 focus:ring-0 focus:ring-gray-100">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className=' bg-white/90'>
                    <SelectItem value="5min">5</SelectItem>
                  <SelectItem value="10min">10</SelectItem>
                  <SelectItem value="30min">30</SelectItem>
                  <SelectItem value="60min">60</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <div className='md:col-span-2 space-y-5'>
            <FormField
            control={form.control}
            name="notAvailableDays"
            render={() => (
                <FormItem>
                {/* Title */}
                <FormLabel className="text-sm font-medium text-gray-700 mt-2 mb-1">
                    Non Working Days
                </FormLabel>

                {/* Days Row */}
                <div className="flex flex-wrap gap-4">
                    {days.map((day) => (
                    <FormField
                        key={day.value}
                        control={form.control}
                        name="notAvailableDays"
                        render={({ field }) => {
                        const values = field.value ?? [];
                        const checked = values.includes(day.value);

                        return (
                            <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox
                                checked={checked}
                                onCheckedChange={(isChecked) => {
                                    if (isChecked) {
                                    field.onChange([...values, day.value]);
                                    } else {
                                    field.onChange(
                                        values.filter((v) => v !== day.value)
                                    );
                                    }
                                }}
                                />
                            </FormControl>

                            <FormLabel className="text-xs font-semibold cursor-pointer">
                                {day.label}
                            </FormLabel>
                            </FormItem>
                        );
                        }}
                    />
                    ))}
                </div>

                <FormMessage className="text-xs text-red-500 mt-2" />
                </FormItem>
            )}
            />
        </div>
    </div>
  )
}

export default doctorOnboardForm3