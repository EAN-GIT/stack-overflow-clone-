// 'use server'
import UserCard from '@/components/cards/UserCard'
import Filter from '@/components/shared/Filter'
import LocalSearchbar from '@/components/shared/LocalSearchbar'
import { UserFilters } from '@/constants/filters'
import { getAllUsers } from '@/lib/actions/user.action'
import React from 'react'

const CommunityPage = async () => {

  const result = await getAllUsers({});


  return (
    <>
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
        
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route={"/commmunity"}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search amazing minds here"
          otherClasses="flex-1"
        />


        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses=" max-md:flex"
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>

        {result.users!.length > 0 ? (
          result.users!.map((user) => (
            <div key={user.id /* replace with the actual unique identifier for the user */}>
               <UserCard key={user._id} user={user} />
            </div>
          ))
        ) : (
          <div>
            No users found
          </div>
        )}
      </section>
    </>
  )
}

export default CommunityPage