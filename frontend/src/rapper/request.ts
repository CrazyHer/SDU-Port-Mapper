/* md5: 29d616fed1283feb358b648565c19f14 */
/* Rap仓库id: 282201 */
/* Rapper版本: 1.2.0 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * 本文件由 Rapper 同步 Rap 平台接口，自动生成，请勿修改
 * Rap仓库 地址: http://rap2.taobao.org/repository/editor?id=282201
 */

import * as commonLib from 'rap/runtime/commonLib'

export interface IModels {
  /**
   * 接口名：login
   * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949203
   */
  'POST/login': {
    Req: {
      email: string
      password: string
    }
    Res: {
      code: number
      message: string
      data: {
        token: string
      }
    }
  }

  /**
   * 接口名：getlist
   * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949204
   */
  'GET/getlist': {
    Req: {}
    Res: {
      data: {
        outerPort: number
        innerAdress: string
        type: string
        comment: string
        author: string
        data: string
      }[]
      code: number
      message: string
    }
  }

  /**
   * 接口名：add
   * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949205
   */
  'POST/add': {
    Req: {
      /**
       * stream或http
       */
      type: string
      data: {
        /**
         * 内网地址
         */
        proxyPass: string
        /**
         * location / { }中的其他配置项
         */
        optherOptions: string
      }
      /**
       * 外部端口
       */
      outerPort: number
    }
    Res: {
      code: number
      message: string
    }
  }

  /**
   * 接口名：del
   * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949209
   */
  'POST/del': {
    Req: {
      /**
       * 外部端口号
       */
      outerPort: number
    }
    Res: {
      code: number
      message: string
    }
  }

  /**
   * 接口名：register
   * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949211
   */
  'POST/register': {
    Req: {
      /**
       * 必须为山大邮箱
       */
      email: string
      password: string
      /**
       * 发送到邮箱的验证码
       */
      verifycode: string
    }
    Res: {
      code: number
      message: string
    }
  }
}

type ResSelector<T> = T

export interface IResponseTypes {
  'POST/login': ResSelector<IModels['POST/login']['Res']>
  'GET/getlist': ResSelector<IModels['GET/getlist']['Res']>
  'POST/add': ResSelector<IModels['POST/add']['Res']>
  'POST/del': ResSelector<IModels['POST/del']['Res']>
  'POST/register': ResSelector<IModels['POST/register']['Res']>
}

export function createFetch(fetchConfig: commonLib.RequesterOption, extraConfig?: {fetchType?: commonLib.FetchType}) {
  if (!extraConfig || !extraConfig.fetchType) {
    console.warn(
      'Rapper Warning: createFetch API will be deprecated, if you want to customize fetch, please use overrideFetch instead, since new API guarantees better type consistency during frontend lifespan. See detail https://www.yuque.com/rap/rapper/overridefetch'
    )
  }
  const rapperFetch = commonLib.getRapperRequest(fetchConfig)

  return {
    /**
     * 接口名：login
     * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949203
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/login': (req?: IModels['POST/login']['Req'], extra?: commonLib.IExtra) => {
      return rapperFetch({
        url: '/login',
        method: 'POST',
        params: req,
        extra,
      }) as Promise<IResponseTypes['POST/login']>
    },

    /**
     * 接口名：getlist
     * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949204
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'GET/getlist': (req?: IModels['GET/getlist']['Req'], extra?: commonLib.IExtra) => {
      return rapperFetch({
        url: '/getlist',
        method: 'GET',
        params: req,
        extra,
      }) as Promise<IResponseTypes['GET/getlist']>
    },

    /**
     * 接口名：add
     * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949205
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/add': (req?: IModels['POST/add']['Req'], extra?: commonLib.IExtra) => {
      return rapperFetch({
        url: '/add',
        method: 'POST',
        params: req,
        extra,
      }) as Promise<IResponseTypes['POST/add']>
    },

    /**
     * 接口名：del
     * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949209
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/del': (req?: IModels['POST/del']['Req'], extra?: commonLib.IExtra) => {
      return rapperFetch({
        url: '/del',
        method: 'POST',
        params: req,
        extra,
      }) as Promise<IResponseTypes['POST/del']>
    },

    /**
     * 接口名：register
     * Rap 地址: http://rap2.taobao.org/repository/editor?id=282201&mod=453464&itf=1949211
     * @param req 请求参数
     * @param extra 请求配置项
     */
    'POST/register': (req?: IModels['POST/register']['Req'], extra?: commonLib.IExtra) => {
      return rapperFetch({
        url: '/register',
        method: 'POST',
        params: req,
        extra,
      }) as Promise<IResponseTypes['POST/register']>
    },
  }
}
