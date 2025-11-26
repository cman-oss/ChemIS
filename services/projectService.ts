import { supabaseClient as supabase } from './supabase';
import { Project } from '../types';

/**
 * Fetches all public projects.
 * Note: RLS policies in Supabase will determine what is returned.
 * Assuming projects are publicly readable.
 */
export const getProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
    return data || [];
};

/**
 * Fetches a single project by its UUID.
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
     const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        // Supabase error 'PGRST116' means no rows found, which is an expected outcome.
        if (error.code !== 'PGRST116') {
            console.error(`Error fetching project with id ${id}:`, error);
            throw error;
        }
        return null;
    }
    return data;
};

/**
 * Fetches all projects for a specific user ID.
 * RLS policies ensure a user can only fetch their own projects.
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
    }
    return data || [];
}
