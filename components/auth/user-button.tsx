"use client"

import React from 'react'
import { FaUser } from 'react-icons/fa'
import { ExitIcon } from '@radix-ui/react-icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import LogoutButton from './logout-button'

const UserButton = () => {

    const user = useCurrentUser()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className='bg-sky-500'>
                        <FaUser className='text-white' />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-40 z-10' align='end'>
                <LogoutButton>
                    <DropdownMenuItem className='bg-white flex items-center p-2 rounded-md'>
                        <ExitIcon className='h-4 w-4 mr-2' />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}

export default UserButton
