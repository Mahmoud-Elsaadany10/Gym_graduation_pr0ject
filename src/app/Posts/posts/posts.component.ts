import { Component, OnInit, HostListener } from '@angular/core';
import { PostService } from '../service/posts-service.service';
import {  Post, PostResponse , Comment, GetCommentByIdResponse} from '../../Model/Models';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  imports: [CommonModule, NavbarComponent, FormsModule],
  standalone: true,
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  currentPage = 1;
  isLoading = false;
  noMorePosts = false;
  longPressTriggered = false;
  isReactionsModalOpen = false;
  selectedReactionsUsers: any[] = [];
  isModalOpen = false;
  newPostContent: string = '';
  activeCommentPostId: number | null = null;
  commentText : string = '';
  longPressTimeout: any;
  showReactionsForPostId: number | null = null;
  selectedImages: File[] = [];


  comments: { [postId: number]: Comment[] } = {};
  replies: { [commentId: number]: Comment[] } = {};

  activeReplyCommentId: number | null = null;
  replyText: string = '';
  commentId: number  = 0;
  activeReplyComment: Comment | null = null;

  constructor(private postService: PostService ,
    private _shared : SharedService
  ) {}

ngOnInit() {
  this.loadPosts(this.currentPage);
  this.getId()
}

loadPosts(page: number) {
  if (this.isLoading || this.noMorePosts) return;

  this.isLoading = true;

  this.postService.getPostsByPage(page).subscribe({
    next: (res: any) => {
      console.log('📡 الاستجابة من الـ API:', res);

      if (res?.isSuccess === false || !res?.data) {
        // console.warn('⚠️ الاستجابة غير ناجحة أو مفيش بيانات');
        this.noMorePosts = true;
        this.isLoading = false;
        return;
      }

      const newPosts = res.data;

      if (newPosts.length === 0) {
        // console.log('⚠️ لا يوجد بوستات جديدة');
        this.noMorePosts = true;
      } else {
        this.posts = [...this.posts, ...newPosts];
        this.currentPage++; // نزود رقم الصفحة للتحميل اللي بعده
        console.log(`✅ تم تحميل ${newPosts.length} بوست`);
      }

      this.isLoading = false;
    },
    error: (error) => {
      console.error('❌ حصل خطأ أثناء تحميل البوستات:', error);
      this.isLoading = false;
    }
  });
}

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getId(){
  const token = this.getToken()
  if(token){
    const decodedToken: any = jwtDecode(token);
    const id = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return id
    }
  }

  deletePost(id :number){
    this.postService.deletePost(id).subscribe({
      next:() =>{
        this._shared.show("deleted successfully","light")
        window.location.reload();
      }
    })
  }
  deleteComment(id :number){
    this.postService.deleteComment(id).subscribe({
      next:() =>{
        this._shared.show("deleted successfully","light")
      this.activeCommentPostId = null;
      }
    })
  }

onCreatePost() {
  this.isModalOpen = true;
}

closeModal() {
  // console.log('❎ Post modal closed');
  this.isModalOpen = false;
  this.newPostContent = '';
}
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    this.selectedImages = Array.from(input.files);
  }
}

submitPost() {
  this.postService.addPost(this.newPostContent, this.selectedImages).subscribe({
    next: () => {
      this.closeModal();
      this.newPostContent = '';
      this.selectedImages = [];
      this.noMorePosts = false;

      this.postService.getPostsByPage(1).subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.posts.unshift(...res.data); // ضيف البوستات الجديدة فوق
          }
        }
      });
    },
    error: (err) => {
      console.error('❌ Error adding post:', err);
    }
  });
}



toggleLike(post: Post, reactionType: 'NORMAL' | 'LOVE' | 'CARE') {
  // console.log(`👍 Toggling like for post ${post.id} with reaction: ${reactionType}`);
  this.showReactionsForPostId = null;

  if (post.isLikedByYou) {
    console.log('💔 Unliking post...');
    this.postService.deleteLike(post.id).subscribe({
      next: () => {
        console.log('✅ Like removed');
        post.isLikedByYou = false;
        post.likeType = null;
        if (post.likesDetails) {
          post.likesDetails.count = Math.max(0, (post.likesDetails.count || 1) - 1);
        }
      },
      error: (err) => {
        console.error('❌ Error deleting like:', err);
      }
    });
  } else {
    console.log('❤️ Adding like...');
    this.postService.addLike(post.id, reactionType).subscribe({
      next: () => {
        console.log('✅ Like added');
        post.isLikedByYou = true;
        post.likeType = reactionType;
        if (post.likesDetails) {
          post.likesDetails.count = (post.likesDetails.count || 0) + 1;
        }
      },
      error: (err) => {
        console.error('❌ Error adding like:', err);
      }
    });
  }
}

startLongPress(post: Post) {
  // console.log(`🕐 Starting long press on post ${post.id}`);
  this.longPressTriggered = false;
  this.longPressTimeout = setTimeout(() => {
    // console.log('⏱️ Long press triggered, showing reactions');
    this.showReactionsForPostId = post.id;
    this.longPressTriggered = true;
  }, 600);
}

cancelLongPress() {
  if (!this.longPressTriggered) {

    clearTimeout(this.longPressTimeout);
  }
}

onLikeClick(post: Post) {
  if (!this.longPressTriggered) {
    // console.log(`👆 Regular like click on post ${post.id}`);
    if (!post.isLikedByYou) {
      this.toggleLike(post, 'NORMAL');
    } else {
      this.toggleLike(post, post.likeType as 'NORMAL' | 'LOVE' | 'CARE');
    }
  }
}

openReactionsModal(postId: number) {
console.log(`📊 Opening reactions modal for post ${postId}`);
this.postService.getPostLikes(postId).subscribe({
  next: (res: any) => {
    if (res?.isSuccess) {
      this.selectedReactionsUsers = res.data;
      this.isReactionsModalOpen = true;
      console.log('✅ Reactions data loaded');
    }
  },
  error: (err) => {
    console.error("❌ Error loading post reactions", err);
  }
});
}

  closeReactionsModal() {
    console.log('❎ Reactions modal closed');
    this.isReactionsModalOpen = false;
  }

  onComment(post: Post) {
    // If this post is already active, close it
    if (this.activeCommentPostId === post.id) {
      this.activeCommentPostId = null;
    } else {
      this.activeCommentPostId = post.id;
      this.getPostById(post.id);
    }
  }

  addComment(postId: number){
    const model ={
      postId: postId,
      content: this.commentText
    }
    this.postService.addComment(model).subscribe({
      next: () => {
        this.commentText = '';
        // Don't close the comment section, just reload the comments
        this.getPostById(postId);
      },
      error: (err) => {
        console.error('❌ Error adding comment:', err);
      }
    });
  }

getPostById(postId: number) {
  this.postService.getPostById(postId).subscribe({
    next: (res: PostResponse) => {
      if (res.isSuccess) {
        // Store top-level comments for the post
        this.comments[postId] = res.data.comments;

        // For each comment, fetch replies and store them separately
        res.data.comments.forEach(comment => {
          this.getComments(comment.id);
        });

      } else {
        this.comments[postId] = [];
      }
    },
    error: (err) => {
      console.error('❌ Error loading post data', err);
      this.comments[postId] = [];
    }
  });
}


getComments(commentId: number) {
  this.postService.getComments(commentId).subscribe({
    next: (res: GetCommentByIdResponse) => {
      if (res.isSuccess) {
        console.log('✅ Comments fetched for comment ID:', commentId, res);

        // Store replies in the separate replies object
        this.replies[commentId] = res.data.comments.map(reply => ({
          id: reply.id,
          userName: reply.userName,
          pictureUrl: reply.pictureUrl,
          content: reply.content,
          date: reply.date,
          likesDetails: null, // Not provided by this endpoint
          comments: []
        }));
      } else {
        this.replies[commentId] = [];
      }
    },
    error: () => {
      this.replies[commentId] = [];
    }
  });
}

toggleReplyBox(comment: Comment) {
  // Toggle open/close
  if (this.activeReplyComment && this.activeReplyComment.id === comment.id) {
    this.activeReplyComment = null;
    this.replyText = '';
    console.log(`💬 Reply box closed for comment ${comment.id}`);
  } else {
    this.activeReplyComment = comment;
    this.replyText = '';
    console.log(`💬 Reply box opened for comment ${comment.id}`);
  }
}


sendReply() {
  if (!this.activeReplyComment) return;

  const model = {
    commentId: this.activeReplyComment.id,
    content: this.replyText
  };

  this.postService.commentOnComment(model).subscribe({
    next: () => {
      console.log('✅ Reply added successfully.');
      this.replyText = '';
      this.activeReplyComment = null;
      // Reload replies for the comment
      console.log(`💬 Reloading replies for comment ${model.commentId}`);
      this.getComments(model.commentId);
    },
    error: (err) => {
      console.error('❌ Error adding reply:', err);
    }
  });
}

  closeReplyModal() {
    this.activeReplyComment = null;
    this.replyText = '';
  }

toggleCommentBox(postId: number) {
  this.activeCommentPostId = this.activeCommentPostId === postId ? null : postId;
  console.log(`💭 Toggling comment input for post ${postId}`);
}

getReactionIcon(type: string): string {
  switch (type) {
    case 'NORMAL':
      return 'assets/ei_like.png';
    case 'LOVE':
      return 'assets/lsicon_user-like-filled.svg';
    case 'CARE':
      return 'assets/mask-group.svg';
    default:
      return 'assets/ei_like.png'; // fallback to default icon
  }
}

}

