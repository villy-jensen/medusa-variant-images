import { AdminProductVariant } from '@medusajs/framework/types';
import { ClientHeaders } from '@medusajs/js-sdk';
import { useMemo, useState } from 'react';

export const sortByCreatedAt = (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

export const sortByTitle = (a: any, b: any) => a.title.localeCompare(b.title);

export const paginationInformation = (variants: AdminProductVariant[] | null) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8; //* Number of variants on the page
  const pageCount = (variants?.length && Math.ceil(variants.length / pageSize)) || 0;

  const canNextPage = useMemo(() => currentPage < pageCount - 1, [currentPage, pageCount]);
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage]);

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentVariants = useMemo(() => {
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, variants?.length || 0);

    return variants?.slice(offset, limit);
  }, [currentPage, pageSize, variants]);

  return {
    pageIndex: currentPage,
    pageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    currentVariants,
  };
};

type OptionArgs = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: ClientHeaders;
  body?: RequestInit['body'] | Record<string, any>;
};

export const fetchBackend = async (url: string, options: OptionArgs = {}) => {
  const optionsObj: RequestInit = {
    credentials: 'include',
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (options.body) optionsObj.body = JSON.stringify(options.body);

  const res = await fetch(url, optionsObj);

  const result = await res.json().catch(() => undefined);

  if (!result) return undefined;

  return result;
};

// export const get = (obj: any[] | {}, propsArg: string | string[], defaultValue?: any) => {
//   if (!obj) {
//     return defaultValue;
//   }

//   let props, prop;
//   if (Array.isArray(propsArg)) {
//     props = propsArg.slice(0);
//   }
//   if (typeof propsArg == 'string') {
//     props = propsArg.split('.');
//   }
//   if (typeof propsArg == 'symbol') {
//     props = [propsArg];
//   }
//   if (!Array.isArray(props)) {
//     throw new Error('props arg must be an array, a string or a symbol');
//   }
//   while (props.length) {
//     prop = props.shift();
//     if (!obj) {
//       return defaultValue;
//     }

//     // @ts-ignore
//     obj = obj[prop];
//     if (obj === undefined) {
//       return defaultValue;
//     }
//   }
//   return obj;
// };
