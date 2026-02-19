import { useAcceptInvitationHook } from '@/hook/workshop.hook'
import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const AcceptInvite = () => {
    // const [searchParams] = useSearchParams()
    // const inviteToken = searchParams.get('invite')
    // console.log(inviteToken)

    const {id} = useParams()
    console.log(id)
    const {data} =useAcceptInvitationHook(id)
    console.log(data)
    
    
    const navigate = useNavigate()
    useEffect(()=>{
      if(data){
        navigate('/home')
      }
    },[data, navigate])

    

  return (
    <div>AcceptInvite</div>
  )
}

export default AcceptInvite