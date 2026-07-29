import { B2cEditProfile, Password } from "../_components/Profile";


export default function B2cProfilePage() {

  return (
 <>
      <div className="grid md:grid-cols-3 justify-between my-5 max-w-7xl mx-auto py-20 px-5 sm:px-10">
        <div className="md:col-span-2 md:mx-0 mx-4">
          <B2cEditProfile />
        </div>
        {/* <div className="md:mx-0 mx-4 md:my-0 my-5">
          <Fare />
          <Otp />
        </div> */}
        <div className="">
          <Password />
        </div>
      </div>
    </>
  )
}
