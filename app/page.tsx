"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"


export default function Home() {
  const router = useRouter();

  function redirectToTasks(){
    router.push('/tasks');
  }
  return (
    <div className = "homeContainer">
      <div className = "heroSection">
        <p className = "heroTitle"> TODO </p>
        <p className = "heroSubtitle"> Your favourite To-Do app </p>
      </div>
      <div className = "featureSection">
        <div className = "featureRow">
          <div className = "featureText">
            Get the most out of our simple todo app!
          </div>
          <div className = "featureGIFContainer">
            <Image className = "featureGIF" src= '/images/Tune Talk.gif' alt = "todo app" height={100} width={100}/>
          </div>
        </div>
      </div>
      <div className = "loginSection">
        <p className = 'signupInvite'> See it for yourself? </p>
        <button className = 'entryButton' onClick={redirectToTasks}> Click to Enter</button>
      </div>
      <div className = "footer"></div>
    </div>
  )
}
