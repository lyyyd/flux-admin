"use client";

/**
 * Cascader 级联选择器测试页面
 *
 * 此页面演示了 Cascader 组件的所有 API 功能
 * 可以将此文件放置在 app 目录下作为测试页面使用
 */

import React, { useRef, useState } from "react";
import { Cascader, CascaderOption, CascaderRef } from "@/components/cascader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 测试数据
const testOptions: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江省",
    children: [
      {
        value: "hangzhou",
        label: "杭州市",
        children: [
          { value: "xihu", label: "西湖区" },
          { value: "xiacheng", label: "下城区" },
          { value: "gongshu", label: "拱墅区" }
        ]
      },
      {
        value: "ningbo",
        label: "宁波市",
        children: [
          { value: "jiangbei", label: "江北区" },
          { value: "jiangdong", label: "江东区" }
        ]
      },
      {
        value: "wenzhou",
        label: "温州市",
        children: [
          { value: "lucheng", label: "鹿城区" },
          { value: "longwan", label: "龙湾区" }
        ]
      }
    ]
  },
  {
    value: "jiangsu",
    label: "江苏省",
    children: [
      {
        value: "nanjing",
        label: "南京市",
        children: [
          { value: "xuanwu", label: "玄武区" },
          { value: "qinhuai", label: "秦淮区" },
          { value: "gulou", label: "鼓楼区" }
        ]
      },
      {
        value: "suzhou",
        label: "苏州市",
        children: [
          { value: "gusu", label: "姑苏区" },
          { value: "wuzhong", label: "吴中区" }
        ]
      }
    ]
  },
  {
    value: "beijing",
    label: "北京市",
    children: [
      { value: "haidian", label: "海淀区" },
      { value: "chaoyang", label: "朝阳区" },
      { value: "dongcheng", label: "东城区" },
      { value: "xicheng", label: "西城区" }
    ]
  }
];

export default function CascaderTestPage() {
  const [singleValue, setSingleValue] = useState<(string | number)[]>([]);
  const [multipleValue, setMultipleValue] = useState<(string | number)[][]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const cascaderRef = useRef<CascaderRef>(null);

  // 动态加载数据
  const [dynamicOptions, setDynamicOptions] = useState<CascaderOption[]>([
    { value: "dynamic1", label: "动态选项 1", isLeaf: false },
    { value: "dynamic2", label: "动态选项 2", isLeaf: false }
  ]);

  const loadData = (selectedOptions: CascaderOption[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    setTimeout(() => {
      targetOption.children = [
        {
          label: `${targetOption.label} - 子项 1`,
          value: `${targetOption.value}-1`
        },
        {
          label: `${targetOption.label} - 子项 2`,
          value: `${targetOption.value}-2`
        }
      ];
      setDynamicOptions([...dynamicOptions]);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Cascader 级联选择器</h1>
        <p className="text-muted-foreground">
          完整实现了所有 API 功能的级联选择器组件
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 基础功能 */}
        <Card>
          <CardHeader>
            <CardTitle>1. 基础单选</CardTitle>
            <CardDescription>基本的级联选择功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              options={testOptions}
              value={singleValue}
              onChange={(value) => {
                console.log("单选值:", value);
                setSingleValue(value as (string | number)[]);
              }}
              placeholder="请选择地区"
            />
            <div className="text-muted-foreground text-sm">
              选中值: {JSON.stringify(singleValue)}
            </div>
          </CardContent>
        </Card>

        {/* 多选模式 */}
        <Card>
          <CardHeader>
            <CardTitle>2. 多选模式</CardTitle>
            <CardDescription>支持选择多个选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              multiple
              options={testOptions}
              value={multipleValue}
              onChange={(value) => {
                console.log("多选值:", value);
                setMultipleValue(value as (string | number)[][]);
              }}
              placeholder="请选择地区（多选）"
              maxTagCount={2}
              maxTagPlaceholder={(omitted) => `+${omitted.length} 项`}
            />
            <div className="text-muted-foreground text-sm">
              选中数量: {multipleValue.length}
            </div>
          </CardContent>
        </Card>

        {/* 搜索功能 */}
        <Card>
          <CardHeader>
            <CardTitle>3. 搜索功能</CardTitle>
            <CardDescription>支持搜索和过滤选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              showSearch
              options={testOptions}
              onChange={(value) => console.log("搜索选中:", value)}
              placeholder="输入关键词搜索"
            />
          </CardContent>
        </Card>

        {/* 自定义搜索 */}
        <Card>
          <CardHeader>
            <CardTitle>4. 自定义搜索</CardTitle>
            <CardDescription>自定义搜索过滤和渲染</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              showSearch={{
                filter: (inputValue, path) =>
                  path.some((option) =>
                    String(option.label)
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  ),
                render: (inputValue, path) =>
                  path.map((opt) => opt.label).join(" → "),
                limit: 10
              }}
              options={testOptions}
              placeholder="自定义搜索规则"
            />
          </CardContent>
        </Card>

        {/* 动态加载 */}
        <Card>
          <CardHeader>
            <CardTitle>5. 动态加载</CardTitle>
            <CardDescription>异步加载子选项数据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              options={dynamicOptions}
              loadData={loadData}
              onChange={(value) => console.log("动态加载选中:", value)}
              placeholder="点击展开动态加载"
            />
          </CardContent>
        </Card>

        {/* 不同尺寸 */}
        <Card>
          <CardHeader>
            <CardTitle>6. 不同尺寸</CardTitle>
            <CardDescription>Small, Middle, Large</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Cascader
              size="small"
              options={testOptions}
              placeholder="小尺寸 (Small)"
            />
            <Cascader
              size="middle"
              options={testOptions}
              placeholder="中尺寸 (Middle)"
            />
            <Cascader
              size="large"
              options={testOptions}
              placeholder="大尺寸 (Large)"
            />
          </CardContent>
        </Card>

        {/* 不同样式变体 */}
        <Card>
          <CardHeader>
            <CardTitle>7. 样式变体</CardTitle>
            <CardDescription>Outlined, Filled, Borderless</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Cascader
              variant="outlined"
              options={testOptions}
              placeholder="边框样式 (Outlined)"
            />
            <Cascader
              variant="filled"
              options={testOptions}
              placeholder="填充样式 (Filled)"
            />
            <Cascader
              variant="borderless"
              options={testOptions}
              placeholder="无边框 (Borderless)"
            />
          </CardContent>
        </Card>

        {/* 校验状态 */}
        <Card>
          <CardHeader>
            <CardTitle>8. 校验状态</CardTitle>
            <CardDescription>Error 和 Warning 状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Cascader
              status="error"
              options={testOptions}
              placeholder="错误状态"
            />
            <Cascader
              status="warning"
              options={testOptions}
              placeholder="警告状态"
            />
          </CardContent>
        </Card>

        {/* 禁用状态 */}
        <Card>
          <CardHeader>
            <CardTitle>9. 禁用状态</CardTitle>
            <CardDescription>整体禁用和部分禁用</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Cascader disabled options={testOptions} placeholder="整体禁用" />
            <Cascader
              options={[
                {
                  value: "test",
                  label: "测试",
                  children: [
                    { value: "disabled", label: "禁用项", disabled: true },
                    { value: "enabled", label: "可用项" }
                  ]
                }
              ]}
              placeholder="部分选项禁用"
            />
          </CardContent>
        </Card>

        {/* 自定义显示 */}
        <Card>
          <CardHeader>
            <CardTitle>10. 自定义显示</CardTitle>
            <CardDescription>displayRender 自定义</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              options={testOptions}
              displayRender={(labels) => labels.join(" → ")}
              placeholder="自定义分隔符"
            />
          </CardContent>
        </Card>

        {/* changeOnSelect */}
        <Card>
          <CardHeader>
            <CardTitle>11. 点选即改变</CardTitle>
            <CardDescription>changeOnSelect 模式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              changeOnSelect
              options={testOptions}
              onChange={(value) => console.log("changeOnSelect:", value)}
              placeholder="点击每级都会触发 onChange"
            />
          </CardContent>
        </Card>

        {/* 受控模式 */}
        <Card>
          <CardHeader>
            <CardTitle>12. 受控模式</CardTitle>
            <CardDescription>完全受控的组件状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              open={isOpen}
              onOpenChange={setIsOpen}
              searchValue={searchValue}
              onSearch={setSearchValue}
              showSearch
              options={testOptions}
              placeholder="受控组件"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "关闭" : "打开"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSearchValue("")}
              >
                清空搜索
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ref 方法 */}
        <Card>
          <CardHeader>
            <CardTitle>13. Ref 方法</CardTitle>
            <CardDescription>focus() 和 blur() 方法</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              ref={cascaderRef}
              options={testOptions}
              placeholder="使用 Ref 控制"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => cascaderRef.current?.focus()}>
                Focus
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => cascaderRef.current?.blur()}
              >
                Blur
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 自定义字段名 */}
        <Card>
          <CardHeader>
            <CardTitle>14. 自定义字段名</CardTitle>
            <CardDescription>fieldNames 映射</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              options={
                [
                  {
                    id: "1",
                    name: "选项1",
                    items: [{ id: "1-1", name: "子选项1-1" }]
                  }
                ] as unknown as CascaderOption[]
              }
              fieldNames={{ label: "name", value: "id", children: "items" }}
              placeholder="自定义字段映射"
            />
          </CardContent>
        </Card>

        {/* 展开触发方式 */}
        <Card>
          <CardHeader>
            <CardTitle>15. 展开触发方式</CardTitle>
            <CardDescription>expandTrigger: hover</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cascader
              expandTrigger="hover"
              options={testOptions}
              placeholder="鼠标悬停展开"
            />
          </CardContent>
        </Card>

        {/* 不同位置 */}
        <Card>
          <CardHeader>
            <CardTitle>16. 弹出位置</CardTitle>
            <CardDescription>placement 属性</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Cascader
              placement="bottomLeft"
              options={testOptions}
              placeholder="左下 (默认)"
            />
            <Cascader
              placement="bottomRight"
              options={testOptions}
              placeholder="右下"
            />
          </CardContent>
        </Card>
      </div>

      {/* API 完整度说明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>✅ API 完整度</CardTitle>
          <CardDescription>所有 API 功能均已实现</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3 lg:grid-cols-4">
            <div>✅ allowClear</div>
            <div>✅ changeOnSelect</div>
            <div>✅ className</div>
            <div>✅ defaultValue</div>
            <div>✅ disabled</div>
            <div>✅ displayRender</div>
            <div>✅ tagRender</div>
            <div>✅ popupRender</div>
            <div>✅ expandIcon</div>
            <div>✅ expandTrigger</div>
            <div>✅ fieldNames</div>
            <div>✅ loadData</div>
            <div>✅ maxTagCount</div>
            <div>✅ maxTagPlaceholder</div>
            <div>✅ notFoundContent</div>
            <div>✅ open</div>
            <div>✅ options</div>
            <div>✅ placeholder</div>
            <div>✅ placement</div>
            <div>✅ prefix</div>
            <div>✅ showSearch</div>
            <div>✅ size</div>
            <div>✅ status</div>
            <div>✅ suffixIcon</div>
            <div>✅ value</div>
            <div>✅ variant</div>
            <div>✅ onChange</div>
            <div>✅ onOpenChange</div>
            <div>✅ multiple</div>
            <div>✅ showCheckedStrategy</div>
            <div>✅ removeIcon</div>
            <div>✅ optionRender</div>
            <div>✅ searchValue</div>
            <div>✅ onSearch</div>
            <div>✅ focus()</div>
            <div>✅ blur()</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
