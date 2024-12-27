"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Sheet } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { SheetsSkeleton } from '@/components/SheetsSkeleton';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

export default function SheetsPage() {
  const { data: session } = useSession();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [title,setTitle] = useState('');

  useEffect(() => {
    if (!session?.user?.email) return;
    loadSheets();
  }, [session?.user?.email]);

  const loadSheets = async () => {
    const { data } = await supabase
      .from('sheets')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (data) {
      setSheets(data);
      setLoading(false);
    }
  };

  const createNewSheet = async () => {
    if (!session?.user?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('sheets')
        .insert({
          title: 'Untitled Sheet',
          content: '// Start coding here',
          owner_id: session.user.email
        })
        .select()
        .single();
  
      if (error) throw error;
      if (data) setSheets([data, ...sheets]);
      
    } catch (error) {
      console.error('Error creating sheet:', error);
    }
  };

  const deleteSheet = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase
        .from('sheets')
        .delete()
        .match({ id: deleteId });

      if (error) throw error;
      setSheets(sheets.filter(sheet => sheet.id !== deleteId));
    } catch (error) {
      console.error('Error deleting sheet:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (sheet: Sheet) => {
    setEditingId(sheet.id);
    setEditTitle(sheet.title);
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sheets')
        .update({ title: editTitle })
        .match({ id });

      if (error) throw error;
      setSheets(sheets.map(sheet => 
        sheet.id === id ? { ...sheet, title: editTitle } : sheet
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating sheet:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Sheets</h1>
        <button
          onClick={createNewSheet}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Sheet
        </button>
      </div>
      
      {loading ? (
        <SheetsSkeleton />
      ) : (
        <div className="grid gap-4">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="p-4 border rounded hover:bg-gray-600 flex justify-between items-center">
              <Link href={`/sheets/${sheet.id}`} className="flex-grow">
                {editingId === sheet.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => saveEdit(sheet.id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(sheet.id)}
                    className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                    autoFocus
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{sheet.title}</h2>
                    <p className="text-gray-500">
                      Last updated: {new Date(sheet.updated_at).toLocaleString()}
                    </p>
                  </>
                )}
              </Link>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(sheet)}
                  className="p-2 text-gray-400 hover:text-blue-500"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => {setDeleteId(sheet.id);setTitle(sheet.title)} }
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmDeleteDialog
          onConfirm={deleteSheet}
          onCancel={() => setDeleteId(null)}
          title={title}
        />
      )}
    </div>
  );
}