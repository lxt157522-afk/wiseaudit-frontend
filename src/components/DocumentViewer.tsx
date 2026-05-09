import React, { useState } from 'react';
import { X, ArrowLeft, Download, Printer, Share2, BookOpen, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker for react-pdf to ensure cross-browser compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
  title: string;
  content?: string | React.ReactNode;
  fileUrl?: string;
  fileType?: string;
  onClose: () => void;
}

export function DocumentViewer({ title, content, fileUrl, fileType, onClose }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleOpenNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  // Content for Standard 1101 based on OCR
  const standard1101Content = (
    <div className="space-y-8 text-gray-800 leading-relaxed">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900">中国注册会计师审计准则第 1101 号</h1>
        <h2 className="text-xl font-serif font-medium text-gray-700">——注册会计师的总体目标和审计工作的基本要求</h2>
        <p className="text-sm text-gray-500">（2022 年 12 月 22 日修订）</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">第一章 总 则</h3>
        <div className="space-y-4">
          <p><strong>第一条</strong> 为了规范注册会计师按照中国注册会计师审计准则（简称审计准则）执行财务报表审计工作，确立注册会计师的总体目标，明确注册会计师为实现总体目标而需要执行审计工作的性质和范围，以及在执行财务报表审计业务时承担的责任，制定本准则。</p>
          <p><strong>第二条</strong> 审计准则适用于注册会计师执行财务报表审计业务。当执行其他历史财务信息审计业务时，注册会计师可以根据具体情况遵守适用的相关审计准则，以满足此类业务的要求。</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">第二章 定 义</h3>
        <div className="space-y-4">
          <p><strong>第三条</strong> 注册会计师，是指取得注册会计师证书并在会计师事务所执业的人员，通常是指项目合伙人或项目组其他成员，有时也指其所在的会计师事务所。</p>
          <p>当审计准则明确指出应由项目合伙人遵守的规定或承担的责任时，使用“项目合伙人”而非“注册会计师”的称谓。</p>
          <p><strong>第四条</strong> 本准则所称财务报表，是指依据某一财务报告编制基础对被审计单位历史财务信息作出的结构性表述，旨在反映某一时点的经济资源或义务，或者某一时期经济资源或义务的变化。</p>
          <p><strong>第五条</strong> 历史财务信息，是指以财务术语表述的某一特定实体的信息，这些信息主要来自特定实体的会计系统，反映了过去一段时间内发生的经济事项，或者过去某一时点的经济状况或情况。</p>
          <p><strong>第六条</strong> 适用的财务报告编制基础，是指法律法规要求采用的财务报告编制基础；或者管理层和治理层（如适用）在编制财务报表时，就被审计单位性质和财务报表目标而言，采用的可接受的财务报告编制基础。</p>
          <p><strong>第七条</strong> 管理层，是指对被审计单位经营活动的执行负有经营管理责任的人员。</p>
          <p><strong>第八条</strong> 治理层，是指对被审计单位战略方向以及管理层履行经营管理责任负有监督责任的人员或组织。</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">第三章 财务报表审计</h3>
        <div className="space-y-4">
          <p><strong>第十八条</strong> 审计的目的提高财务报表预期使用者对财务报表的信赖程度。这一目的可以通过注册会计师对财务报表是否在所有重大方面按照通的财务报告编制基础编制发表审计意见得以实现。</p>
          <p><strong>十九条</strong> 财务报表是由被审计单位管理层在治理层的监督下编制的。审计准则不对管理层或治理层设定责任，也不超越法律法规对管理层或治理层责任作出的规定。</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">第四章 总体目标</h3>
        <div className="space-y-4">
          <p><strong>第二十五条</strong> 在执行财务报表审计工作时，注册会计师的总体目标是：</p>
          <p>（一）对财务报表整体是否不存在由于舞弊或错误导致的重大错报获取合理保证，使得注册会计师能够对财务报表是否在所有重大方面按照适用的财务报告编制基础编制发表审计意见；</p>
          <p>（二）按照审计准则的规定，根据审计结果对财务报表出具审计报告，并与管理层和治理层沟通。</p>
        </div>
      </section>

      <div className="pt-12 border-t border-gray-100 text-center text-gray-400 text-xs">
        <p>--- 本文档由 WiseAudit 知识库提供 ---</p>
        <img 
          src="/wiseaudit.png" 
          alt="WiseAudit" 
          className="w-12 h-12 mx-auto mt-4 opacity-20 grayscale"
          onError={(e) => e.currentTarget.style.display = 'none'}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    // Handling Files (PDF, Images)
    if (fileUrl) {
      if (fileType === 'application/pdf') {
        return (
          <div className="flex flex-col items-center bg-gray-100 min-h-[600px] rounded-xl overflow-hidden shadow-inner">
            <div className="w-full h-full flex flex-col items-center p-4">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">正在解析 PDF 渲染引擎...</p>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center p-20 space-y-6 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300" />
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-900">PDF 加载失败</p>
                      <p className="text-xs text-gray-500">可能是由于浏览器安全策略拦截了内嵌预览。</p>
                    </div>
                    <button 
                      onClick={handleOpenNewTab}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center space-x-2"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>在新窗口打开预览</span>
                    </button>
                  </div>
                }
              >
                <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200">
                  <Page 
                    pageNumber={pageNumber} 
                    scale={1.2}
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                  />
                </div>
              </Document>
              
              {numPages && (
                <div className="mt-6 flex items-center space-x-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200 shadow-lg sticky bottom-4">
                  <button 
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <p className="text-xs font-bold text-gray-700 tabular-nums">
                    第 {pageNumber} 页 / 共 {numPages} 页
                  </p>
                  <button 
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-px h-4 bg-gray-200" />
                  <button 
                    onClick={handleOpenNewTab}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-blue-600"
                    title="全屏查看"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }

      if (fileType?.startsWith('image/')) {
        return (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl overflow-hidden min-h-[400px]">
            <img 
              src={fileUrl} 
              alt={title} 
              className="max-w-full h-auto shadow-2xl rounded-sm" 
              referrerPolicy="no-referrer"
            />
          </div>
        );
      }
    }

    if (content) {
      if (typeof content === 'string') {
        return (
          <div className="prose prose-blue max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {content}
            </div>
            <div className="pt-12 border-t border-gray-100 text-center text-gray-400 text-[10px] uppercase tracking-widest mt-12">
              <p>--- 本文档由审计中心实时生成/提供 ---</p>
            </div>
          </div>
        );
      }
      return content;
    }

    if (title.includes('1101')) return standard1101Content;

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 py-20">
        <BookOpen className="w-16 h-16 opacity-20" />
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900">正在检索文档内容...</p>
          <p className="text-xs mt-1">系统已解析该文件元数据，正从分布式存储节点提取全文内容。</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 bg-white z-50 flex flex-col"
    >
      {/* Toolbar */}
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-gray-900 truncate max-w-md">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">下载</span>
          </button>
          <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 flex items-center space-x-2">
            <Printer className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">打印</span>
          </button>
          <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-white">
        <div className="max-w-3xl mx-auto bg-white p-12 shadow-sm border border-gray-100 rounded-sm min-h-full">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
}
