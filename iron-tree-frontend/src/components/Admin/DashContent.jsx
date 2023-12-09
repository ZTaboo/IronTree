import {Card, Progress, Table, Timeline} from "antd";
import {Chart} from '@antv/g2';
import {useEffect, useState} from "react";
import {useTheme} from "@/store/store.jsx";
import {DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

// 我的任务
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '标题',
        dataIndex: 'title',
    },
    {
        title: '描述',
        dataIndex: 'description',
    },
];
const Row = (props) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            },
        ),
        transition,
        cursor: 'move',
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};


export const DashContent = () => {
    const {dark} = useTheme()

    // 我的任务数据
    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            name: '修复BUG',
            title: "修复请求BUG",
            description: 'Sidney No. 1 Lake Park',
        },
        {
            key: '2',
            name: '修复BUG',
            title: "修复请求BUG1",
            description: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            name: '修复BUG',
            title: "修复请求BUG2",
            description: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: '修复BUG',
            title: "修复请求BUG",
            description: 'Sidney No. 1 Lake Park',
        },
        {
            key: '5',
            name: '修复BUG',
            title: "修复请求BUG1",
            description: 'Sidney No. 1 Lake Park',
        },
        {
            key: '6',
            name: '修复BUG',
            title: "修复请求BUG2",
            description: 'Sidney No. 1 Lake Park',
        },
    ]);
    // 我的进度数据列表
    const [planData, setPlanData] = useState([
        {
            key: '1',
            objectives: '修复BUG',
            progress: 100,
            time: '2021-01-01 12:00:00',
        },
        {
            key: '2',
            objectives: '修复BUG',
            progress: 50,
            time: '2021-01-01 12:00:00',
        },
        {
            key: '3',
            objectives: '修复BUG',
            progress: 30,
            time: '2021-01-01 12:00:00',
        },
        {
            key: '4',
            objectives: '修复BUG',
            progress: 20,
            time: '2021-01-01 12:00:00',
        },
        {
            key: '5',
            objectives: '修复BUG',
            progress: 10,
            time: '2021-01-01 12:00:00',
        }
    ])
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    // 我的计划规范
    const planColumns = [
        {
            width: 120,
            title: '目标',
            dataIndex: 'objectives',
        },
        {
            width: 250,
            title: '进度',
            dataIndex: 'progress',
            render: (_, record) => (
                <Progress strokeColor={{'0%': '#108ee9', '100%': '#87d'}} percent={record.progress}></Progress>
            ),
        },
        {
            width: 160,
            title: '完成时间',
            dataIndex: 'time',
        },
    ]

    // 处理拖拽排序事件
    const onDragEnd = ({active, over}) => {
        if (active.id !== over?.id) {
            setDataSource((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const getG2 = () => {
        const chart = new Chart({
            container: 'objectives',
            height: 400,
            autoFit: true,
            theme: dark ? 'classicDark' : 'classic',
        });
        chart.coordinate({type: 'theta'});

        chart
            .interval()
            .data([
                {genre: 'BUG修复', sold: 275},
                {genre: '新需求', sold: 115},
                {genre: '其它', sold: 120},
            ])
            .transform({type: 'stackY'})
            .encode('color', 'genre')
            .encode('y', 'sold')
            .animate('enter', {type: 'waveIn', duration: 1000});

        chart.render();
    }
    const getVisitsG2 = () => {
        const chart = new Chart({
            container: 'visits',
            height: 400,
            autoFit: true,
            theme: dark ? 'classicDark' : 'classic',
        });

        chart.data({
            type: 'fetch',
            value: 'https://assets.antv.antgroup.com/g2/aapl.json',
        });

        chart
            .area()
            .encode('x', (d) => new Date(d.date))
            .encode('y', 'close')
            .animate('enter', {
                type: 'scaleInY', // 指定入场动画的类型
                duration: 1000, // 指定入场动画的执行时间
            });

        chart.render();

    }
    useEffect(() => {
        getG2()
        getVisitsG2()
    }, [dark])
    return (
        <div className={'w-full mt-[15px]'}>
            <div className={'grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-[15px] select-none'}>
                <Card title={'本月完成'} size={"small"}>
                    <div id={'objectives'}></div>
                </Card>
                <Card title={'我的任务'} size={"small"}>
                    <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                        <SortableContext
                            items={dataSource.map((i) => i.key)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Table
                                components={{
                                    body: {
                                        row: Row,
                                    },
                                }}
                                rowKey="key"
                                pagination={{position: ['none']}}
                                columns={columns}
                                dataSource={dataSource}
                                size={"small"}></Table>
                        </SortableContext>
                    </DndContext>
                </Card>
                <Card title={'版本更新'} size={"small"}>
                    <div className={'max-w-[400px]'}>
                        <Timeline
                            pending="开发中..."
                            mode={'left'}
                            items={[
                                {
                                    label: '2023-12-01',
                                    children: '创建项目',
                                },
                                {
                                    label: '2023-12-05',
                                    children: '开始开发',
                                }
                            ]}
                        />
                    </div>
                </Card>


            </div>
            {/*    下方项目进度部分*/}
            <div className={'grid grid-cols-12 gap-[15px] mt-[15px] select-none'}>
                <Card title={'访问量'} className={'lg:col-span-8 col-span-12'} size={"small"}>
                    <div id={'visits'}></div>
                </Card>
                <Card className={'lg:col-span-4 col-span-12'} title={'计划'} size={"small"}>
                    <Table columns={planColumns} size={"small"} pagination={{position: ['none']}}
                           dataSource={planData}></Table>
                </Card>
            </div>
        </div>
    )
}