import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { days } from './../../lib/constant'
import { Checkbox } from '../ui/checkbox'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { BasicDocInfoFormData } from './onboardDoctor'
import { Button } from '../ui/button'

const doctorOnboardForm3 = ({ form } : { form : UseFormReturn<BasicDocInfoFormData>}) => {
  const { fields , append, remove } = useFieldArray({
    control: form.control,
    name: "dailyTimeRange",
  });
  
  return (
    <div className="grid grid-cols-1 px-3 items-start py-1 md:grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="availabilityRange.startDate"
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
          name="availabilityRange.endDate"
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
          name="slotDurationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-600">
                Appointment Slot Duration
              </FormLabel>
              <Select value={field.value ? field.value.toString() : ""}
              onValueChange={(value) => field.onChange(Number(value))} >
                <FormControl>
                  <SelectTrigger className="h-14 w-full rounded-lg border border-gray-300 focus:ring-0 focus:ring-gray-100">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className=' bg-white/90'>
                  <SelectItem value="5">5 Min</SelectItem>
                  <SelectItem value="10">10 Min</SelectItem>
                  <SelectItem value="30">30 Min</SelectItem>
                  <SelectItem value="60">60 Min</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <div className='md:col-span-2 space-y-5'>
            <FormField
            control={form.control}
            name="availabilityRange.excludedWeekdays"
            render={({ field }) => {
              const values: number[] = field.value ?? [];

              return (
                <FormItem>
                  {/* Title */}
                  <FormLabel className="text-sm font-medium text-gray-700 mt-2 mb-1">
                    Non Working Days
                  </FormLabel>

                  {/* Days */}
                  <div className="flex flex-wrap gap-4">
                    {days.map((day) => {
                      const checked = values.includes(day.value);

                      return (
                        <div
                          key={day.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              if (isChecked) {
                                field.onChange([...values, day.value]);
                              } else {
                                field.onChange(values.filter((v) => v !== day.value));
                              }
                            }}
                          />

                          <span className="text-xs font-semibold cursor-pointer">
                            {day.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <FormMessage className="text-xs text-red-500 mt-2" />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="dailyTimeRange"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 mt-3">
                  Daily Working Hours
                </FormLabel>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className='py-3 px-4 rounded-lg'>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border border-gray-300 rounded-lg px-6 p-4"
                      >
                        {/* Start Time */}
                        <FormField
                          control={form.control}
                          name={`dailyTimeRange.${index}.start`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-gray-600">
                                Session {index + 1} –  Start Time
                              </FormLabel>
                              <FormControl>
                                <Input type="time" className='text-gray-400 font-sans' {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* End Time */}
                        <FormField
                          control={form.control}
                          name={`dailyTimeRange.${index}.end`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-gray-600">
                                Session {index + 1} – End Time
                              </FormLabel>
                              <FormControl>
                                <Input className='text-gray-400 font-sans' type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                      </div>
                        {/* Remove */}
                        <Button
                          className='bg-red-400 font-sans cursor-pointer font-bold w-full mx-auto mt-3'
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          Remove
                        </Button>
                    </div>
                  ))}

                  {/* Add Session */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer py-2"
                    onClick={() =>
                      append({
                        start: "08:00",
                        end: "12:00",
                      })
                    }
                  >
                    + Add Another Time Session
                  </Button>
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