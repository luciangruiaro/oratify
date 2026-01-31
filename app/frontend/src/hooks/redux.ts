/**
 * Typed Redux Hooks
 *
 * These hooks provide TypeScript-typed versions of useDispatch and useSelector.
 * Always use these instead of the plain react-redux hooks for proper typing.
 *
 * Usage:
 *   import { useAppDispatch, useAppSelector } from '@/hooks/redux'
 *
 *   const dispatch = useAppDispatch()
 *   const user = useAppSelector(state => state.auth.user)
 */

import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

/**
 * Typed dispatch hook - use instead of plain useDispatch
 */
export const useAppDispatch: () => AppDispatch = useDispatch

/**
 * Typed selector hook - use instead of plain useSelector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
