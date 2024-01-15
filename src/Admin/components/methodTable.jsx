import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMethodAction } from '../../redux/methodSlice';
import { deleteMethodAction } from '../../redux/methodSlice';
import MethodCard from '../components/adminMethodCard'
import '../adminStyles/table.css'
import { useState } from 'react';
import { mirage } from 'ldrs'

mirage.register()

const AdminMethodTable = () => {

  const [ page, setPage ] = useState(1)

const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchAllMethodAction(+page))
    },[dispatch, page, setPage])

    const userData = useSelector(state => state?.user?.userAuth);
 
  const allMethod = useSelector(state => state?.deposit) 
  const {loading, appErr, serverErr, depositList} = allMethod;

  const depositData = useSelector((state) => state.method.methodList);
  console.log(depositData)
  // const depositCardList = depositData.slice();

  //categories depositmethods
  const depositCardListCryptocurrencies = depositData.filter(el => el,[]) 

  const loadingArray = new Array(1).fill(null)

  const handleDelete = () => {
    dispatch(deleteMethodAction());
  };

  return (
    <div>
    <div className="crypto methods">
          {depositCardListCryptocurrencies[0] ?
            depositCardListCryptocurrencies.map((el) => {
              return (
                <MethodCard
                  key={el._id}
                  id={el._id}
                  image={el.image}
                  name={el.name}
                  number={el.number}
                  user={el.user}
                  description={el.description}
                />
              );
            })
          :loadingArray.map(el=>{
            return(
              <MethodCard/>
            )
          })
          }
        </div>
    </div>
  )
}

export default AdminMethodTable;

