import { useParams } from "react-router-dom";
import { Table, Button, Spin, Avatar } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserTypes } from "../../models/users";
import { api } from "../../services/api";
import CardCustom from "../../components/CardCustom";

export default function Detail(){
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])
    const columns = [
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'First Name',
          dataIndex: 'first_name',
          key: 'first_name',
        },
        {
          title: 'Last Name',
          dataIndex: 'last_name',
          key: 'last_name',
        },
        {
          title: 'Photo',
          dataIndex: 'avatar',
          key: 'avatar',
          render: (_:any, response:any)=> <Avatar src={response?.avatar} /> 
        }
      ];
    async function user(){
        return await api
        .get<UserTypes.GetUser>('users')
        .then((response: any)=> setData(response.data.data)).finally(()=>setLoading(false));
    }

    useEffect(() => {
        user();
    }, []);
    
    console.log(data)

    if(loading) return <Spin />

    return (<>
    <div> Ini detail {params?.username} </div> 
    <Table dataSource={data} 
    columns={columns}
    
    />
    <CardCustom name="Delton" />
    </>);
}