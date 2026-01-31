import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { days } from './../../lib/constant'
import { Checkbox } from '../ui/checkbox'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { BasicDocInfoFormData } from './onboardDoctor'
import { Button } from '../ui/button'
import { Plus, Trash2 } from 'lucide-react'

const doctorOnboardForm3 = ({ form } : { form : UseFormReturn<BasicDocInfoFormData>}) => {
  const { fields , append, remove } = useFieldArray({
    control: form.control,
    name: "dailyTimeRange",
  });
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 px-4 py-6 items-start md:grid-cols-2 gap-6">
        
        {/* Available From */}
        <FormField
          control={form.control}
          name="availabilityRange.startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                Available From
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
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
                    text-gray-700
                  "
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Available Until */}
        <FormField
          control={form.control}
          name="availabilityRange.endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-700">
                Available Until
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
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
                    text-gray-700
                  "
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Slot Duration */}
        <FormField
          control={form.control}
          name="slotDurationMinutes"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Appointment Slot Duration
                <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Select 
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <FormControl>
                  <SelectTrigger 
                    className="
                      h-11 w-full md:w-64 rounded-lg
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
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  <SelectItem value="5" className="cursor-pointer hover:bg-blue-50">5 Minutes</SelectItem>
                  <SelectItem value="10" className="cursor-pointer hover:bg-blue-50">10 Minutes</SelectItem>
                  <SelectItem value="30" className="cursor-pointer hover:bg-blue-50">30 Minutes</SelectItem>
                  <SelectItem value="60" className="cursor-pointer hover:bg-blue-50">60 Minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />

        <div className='md:col-span-2 space-y-6'>
          
          {/* Non Working Days */}
          <FormField
            control={form.control}
            name="availabilityRange.excludedWeekdays"
            render={({ field }) => {
              const values: number[] = field.value ?? [];

              return (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 mb-3 block">
                    Non-Working Days
                  </FormLabel>
                  
                  <p className="text-xs text-gray-600 mb-3">
                    Select the days when you are not available for consultations
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {days.map((day) => {
                      const checked = values.includes(day.value);

                      return (
                        <label
                          key={day.value}
                          className={`
                            flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg
                            transition-all cursor-pointer min-w-[90px]
                            ${checked 
                              ? 'bg-red-50 border border-red-300' 
                              : 'bg-white border border-gray-200 hover:border-blue-300'
                            }
                          `}
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

                          <span className="text-sm font-medium text-gray-700 select-none">
                            {day.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <FormMessage className="text-red-500 text-xs mt-2" />
                </FormItem>
              );
            }}
          />

          {/* Daily Working Hours */}
          <FormField
            control={form.control}
            name="dailyTimeRange"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 mb-3 block">
                  Daily Working Hours
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                
                <p className="text-xs text-gray-600 mb-4">
                  Add your working time sessions for each day
                </p>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div 
                      key={field.id} 
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">
                          Session {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed h-8 px-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Start Time */}
                        <FormField
                          control={form.control}
                          name={`dailyTimeRange.${index}.start`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-gray-600">
                                Start Time
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  className="
                                    h-10 rounded-lg
                                    border border-gray-300
                                    bg-white
                                    hover:border-blue-400
                                    focus:outline-none
                                    focus:ring-1
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition-all
                                    text-gray-700
                                  "
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs mt-1" />
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
                                End Time
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="time"
                                  className="
                                    h-10 rounded-lg
                                    border border-gray-300
                                    bg-white
                                    hover:border-blue-400
                                    focus:outline-none
                                    focus:ring-1
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition-all
                                    text-gray-700
                                  "
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Session Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="
                      w-full h-11 rounded-lg
                      border border-dashed border-gray-300
                      hover:border-blue-400 hover:bg-blue-50
                      transition-all
                      font-semibold text-gray-700
                      flex items-center justify-center gap-2
                    "
                    onClick={() =>
                      append({
                        start: "08:00",
                        end: "12:00",
                      })
                    }
                  >
                    <Plus size={18} />
                    Add Another Time Session
                  </Button>
                </div>

                <FormMessage className="text-red-500 text-xs mt-2" />
              </FormItem>
            )}
          />

        </div>
      </div>
    </div>
  )
}

export default doctorOnboardForm3