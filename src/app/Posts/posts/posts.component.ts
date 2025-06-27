import { Component, OnInit, HostListener } from '@angular/core';
import { PostService } from '../service/posts-service.service';
import { CommentResponse, Post } from '../../Model/Models';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { FormsModule } from '@angular/forms';

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
  commentData!: CommentResponse['data'];


  constructor(private postService: PostService) {}

ngOnInit() {
  console.log('🔁 Component initialized. Loading posts...');
  this.loadPosts(this.currentPage);
}

loadPosts(page: number) {
  // لو جاري التحميل بالفعل أو مفيش بوستات تانية، مفيش داعي نطلب تاني
  if (this.isLoading || this.noMorePosts) return;

  console.log(`📦 جاري تحميل البوستات للصفحة رقم ${page}...`);
  this.isLoading = true;

  // نطلب البوستات من السيرفر حسب رقم الصفحة
  this.postService.getPostsByPage(page).subscribe({
    next: (res: any) => {
      console.log('📡 الاستجابة من الـ API:', res);

      // لو الاستجابة فيها مفتاح isSuccess = false، نوقف التحميل
      if (res?.isSuccess === false || !res?.data) {
        console.warn('⚠️ الاستجابة غير ناجحة أو مفيش بيانات');
        this.noMorePosts = true;
        this.isLoading = false;
        return;
      }

      const newPosts = res.data;

      if (newPosts.length === 0) {
        console.log('⚠️ لا يوجد بوستات جديدة');
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


@HostListener('window:scroll', [])
onScroll(): void {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    console.log('📜 Scrolled to bottom. Trying to load more posts...');
    this.loadPosts(this.currentPage);
  }
}

onCreatePost() {
  console.log('📝 Create post modal opened');
  this.isModalOpen = true;
}

closeModal() {
  console.log('❎ Post modal closed');
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
  console.log('📨 Submitting new post...');

  this.postService.addPost(this.newPostContent, this.selectedImages).subscribe({
    next: () => {
      console.log('✅ Post added successfully');
      this.closeModal();
      this.posts = [];
      this.currentPage = 1;
      this.noMorePosts = false;
      this.loadPosts(this.currentPage);
    },
    error: (err) => {
      console.error('❌ Error adding post:', err);
    }
  });
}


toggleLike(post: Post, reactionType: 'NORMAL' | 'LOVE' | 'CARE') {
  console.log(`👍 Toggling like for post ${post.id} with reaction: ${reactionType}`);
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
  console.log(`🕐 Starting long press on post ${post.id}`);
  this.longPressTriggered = false;
  this.longPressTimeout = setTimeout(() => {
    console.log('⏱️ Long press triggered, showing reactions');
    this.showReactionsForPostId = post.id;
    this.longPressTriggered = true;
  }, 600);
}

cancelLongPress() {
  if (!this.longPressTriggered) {
    console.log('🚫 Long press cancelled');
    clearTimeout(this.longPressTimeout);
  }
}

onLikeClick(post: Post) {
  if (!this.longPressTriggered) {
    console.log(`👆 Regular like click on post ${post.id}`);
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
  this.activeCommentPostId = this.activeCommentPostId === post.id ? null : post.id;
  console.log(`💬 Comment box toggled for post ${post.id}. Active post ID: ${this.activeCommentPostId}`);
  }

  addComment(postId: number){
    const model ={
      postId: postId,
      content: this.commentText
    }
    this.postService.addComment(model).subscribe({
      next: () => {
        console.log('✅ Comment added successfully');
        this.commentText = '';
        this.activeCommentPostId = null;
      },
      error: (err) => {
        console.error('❌ Error adding comment:', err);
      }
    });
  }


  getComments(postId: number) {
  this.postService.getComments(postId).subscribe({
    next: (res: CommentResponse) => {
      if (res.isSuccess) {
        this.commentData = res.data;
      }
    }
  });
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
