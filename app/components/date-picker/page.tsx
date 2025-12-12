"use client";

import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerAdvanced, RangePicker } from "@/components/date-time-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";

export default function DatePickerPage() {
  const [date1, setDate1] = useState<Dayjs | null>(null);
  const [date2, setDate2] = useState<Dayjs | null>(dayjs());
  const [date3, setDate3] = useState<Dayjs | null>(null);
  const [date4, setDate4] = useState<Dayjs | null>(null);
  const [range1, setRange1] = useState<[Dayjs, Dayjs] | null>(null);
  const [range2, setRange2] = useState<[Dayjs, Dayjs] | null>(null);
  const [range3, setRange3] = useState<[Dayjs, Dayjs] | null>(null);

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">DatePicker Advanced</h1>
          <p className="text-muted-foreground mt-2">
            Complete date and datetime picker with range support, built on
            shadcn/ui
          </p>
        </div>

        {/* Basic DatePicker */}
        <Card>
          <CardHeader>
            <CardTitle>Basic DatePicker</CardTitle>
            <CardDescription>Simple date selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Default</label>
              <DatePickerAdvanced
                value={date1}
                onChange={(date) => setDate1(date)}
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                With Default Value
              </label>
              <DatePickerAdvanced
                value={date2}
                onChange={(date) => setDate2(date)}
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Disabled</label>
              <DatePickerAdvanced disabled placeholder="Select date" />
            </div>
          </CardContent>
        </Card>

        {/* DatePicker with Time */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker with Time</CardTitle>
            <CardDescription>Date and time selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                DateTime (HH:mm:ss)
              </label>
              <DatePickerAdvanced
                value={date3}
                onChange={(date) => setDate3(date)}
                showTime
                placeholder="Select datetime"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                DateTime (HH:mm)
              </label>
              <DatePickerAdvanced
                value={date4}
                onChange={(date) => setDate4(date)}
                showTime={{ showSecond: false }}
                placeholder="Select datetime"
              />
            </div>
          </CardContent>
        </Card>

        {/* DatePicker with Presets */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker with Presets</CardTitle>
            <CardDescription>
              Quick selection with preset values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerAdvanced
              placeholder="Select date"
              presets={[
                { label: "Today", value: dayjs() },
                { label: "Yesterday", value: dayjs().subtract(1, "day") },
                { label: "Last Week", value: dayjs().subtract(7, "day") },
                { label: "Last Month", value: dayjs().subtract(1, "month") }
              ]}
            />
          </CardContent>
        </Card>

        {/* DatePicker Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker Sizes</CardTitle>
            <CardDescription>Different size variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Small</label>
              <DatePickerAdvanced size="small" placeholder="Select date" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Middle (Default)
              </label>
              <DatePickerAdvanced size="middle" placeholder="Select date" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Large</label>
              <DatePickerAdvanced size="large" placeholder="Select date" />
            </div>
          </CardContent>
        </Card>

        {/* DatePicker Variants */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker Variants</CardTitle>
            <CardDescription>Different visual styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Outlined (Default)
              </label>
              <DatePickerAdvanced
                variant="outlined"
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Filled</label>
              <DatePickerAdvanced variant="filled" placeholder="Select date" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Borderless
              </label>
              <DatePickerAdvanced
                variant="borderless"
                placeholder="Select date"
              />
            </div>
          </CardContent>
        </Card>

        {/* DatePicker Status */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker Status</CardTitle>
            <CardDescription>Different status states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Error</label>
              <DatePickerAdvanced status="error" placeholder="Select date" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Warning</label>
              <DatePickerAdvanced status="warning" placeholder="Select date" />
            </div>
          </CardContent>
        </Card>

        {/* RangePicker */}
        <Card>
          <CardHeader>
            <CardTitle>RangePicker</CardTitle>
            <CardDescription>Date range selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Basic Range
              </label>
              <RangePicker
                value={range1}
                onChange={(dates) => setRange1(dates)}
                placeholder={["Start date", "End date"]}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Disabled</label>
              <RangePicker disabled placeholder={["Start date", "End date"]} />
            </div>
          </CardContent>
        </Card>

        {/* RangePicker with Time */}
        <Card>
          <CardHeader>
            <CardTitle>RangePicker with Time</CardTitle>
            <CardDescription>Date and time range selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                DateTime Range (HH:mm:ss)
              </label>
              <RangePicker
                value={range2}
                onChange={(dates) => setRange2(dates)}
                showTime
                placeholder={["Start datetime", "End datetime"]}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                DateTime Range (HH:mm)
              </label>
              <RangePicker
                value={range3}
                onChange={(dates) => setRange3(dates)}
                showTime={{ showSecond: false }}
                placeholder={["Start datetime", "End datetime"]}
              />
            </div>
          </CardContent>
        </Card>

        {/* RangePicker with Presets */}
        <Card>
          <CardHeader>
            <CardTitle>RangePicker with Presets</CardTitle>
            <CardDescription>
              Quick selection with preset ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RangePicker
              placeholder={["Start date", "End date"]}
              presets={[
                {
                  label: "Today",
                  value: [dayjs().startOf("day"), dayjs().endOf("day")]
                },
                {
                  label: "Last 7 Days",
                  value: [dayjs().subtract(6, "day"), dayjs()]
                },
                {
                  label: "Last 30 Days",
                  value: [dayjs().subtract(29, "day"), dayjs()]
                },
                {
                  label: "This Month",
                  value: [dayjs().startOf("month"), dayjs().endOf("month")]
                },
                {
                  label: "Last Month",
                  value: [
                    dayjs().subtract(1, "month").startOf("month"),
                    dayjs().subtract(1, "month").endOf("month")
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* Date Constraints */}
        <Card>
          <CardHeader>
            <CardTitle>Date Constraints</CardTitle>
            <CardDescription>Min/Max date and disabled dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Min/Max Date (Only current month)
              </label>
              <DatePickerAdvanced
                minDate={dayjs().startOf("month")}
                maxDate={dayjs().endOf("month")}
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Disabled Weekends
              </label>
              <DatePickerAdvanced
                disabledDate={(date) => {
                  const day = date.day();
                  return day === 0 || day === 6;
                }}
                placeholder="Select date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>Additional customization options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Need Confirm
              </label>
              <DatePickerAdvanced needConfirm placeholder="Select date" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Read Only Input
              </label>
              <DatePickerAdvanced inputReadOnly placeholder="Select date" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                No Clear Button
              </label>
              <DatePickerAdvanced
                allowClear={false}
                placeholder="Select date"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
